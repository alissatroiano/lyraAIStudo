import { ProcessedLesson } from '../types';

export interface CreateSlidesResult {
  presentationId: string;
  presentationUrl: string;
  embedUrl: string;
}

/**
 * Creates a Google Slides presentation for a given lesson plan.
 * Uses the client's access token to call the Google Slides API.
 */
export async function createGoogleSlides(
  lesson: ProcessedLesson,
  accessToken: string
): Promise<CreateSlidesResult> {
  // 1. Create a blank presentation
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: lesson.lessonTitle,
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Failed to create presentation: ${createRes.statusText}`
    );
  }

  const presentation = await createRes.json();
  const presentationId = presentation.presentationId;

  // Find the placeholders on the default first slide (which Google Slides creates automatically)
  const firstSlide = presentation.slides?.[0];
  let titleBoxId: string | null = null;
  let subtitleBoxId: string | null = null;

  if (firstSlide && firstSlide.pageElements) {
    for (const element of firstSlide.pageElements) {
      if (element.placeholder) {
        if (element.placeholder.type === 'TITLE' || element.placeholder.type === 'CENTERED_TITLE') {
          titleBoxId = element.objectId;
        } else if (element.placeholder.type === 'SUBTITLE') {
          subtitleBoxId = element.objectId;
        }
      }
    }
  }

  // 2. Build the list of batch updates to customize the presentation
  const requests: any[] = [];
  const timestamp = Date.now();

  // Populate first slide (Title Slide)
  if (titleBoxId) {
    requests.push({
      insertText: {
        objectId: titleBoxId,
        text: lesson.lessonTitle,
      },
    });
  }
  if (subtitleBoxId) {
    requests.push({
      insertText: {
        objectId: subtitleBoxId,
        text: `Duration: ${lesson.duration} Block | Created by Lyra STEM Assistant`,
      },
    });
  }

  // Slide 2: Lesson Overview & Takeaways
  const overviewSlideId = `overview_slide_${timestamp}`;
  const overviewTitleId = `overview_title_${timestamp}`;
  const overviewBodyId = `overview_body_${timestamp}`;

  requests.push({
    createSlide: {
      objectId: overviewSlideId,
      slideLayoutReference: {
        predefinedLayout: 'TITLE_AND_BODY',
      },
      placeholderIdMappings: [
        {
          layoutPlaceholder: { type: 'TITLE', index: 0 },
          objectId: overviewTitleId,
        },
        {
          layoutPlaceholder: { type: 'BODY', index: 0 },
          objectId: overviewBodyId,
        },
      ],
    },
  });

  requests.push({
    insertText: {
      objectId: overviewTitleId,
      text: 'Lesson Overview',
    },
  });

  const overviewText = `${lesson.summary || 'Prepare for a fun-filled, interactive STEM lesson!'}\n\nKey Takeaways:\n` +
    (lesson.keyTakeaways && lesson.keyTakeaways.length > 0
      ? lesson.keyTakeaways.map((t) => `• ${t}`).join('\n')
      : '• Active scientific exploration\n• Hands-on scientific investigation\n• Collaborative problem solving');

  requests.push({
    insertText: {
      objectId: overviewBodyId,
      text: overviewText,
    },
  });

  // Slides 3+: Main Lesson Content Slides
  if (lesson.slides && lesson.slides.length > 0) {
    lesson.slides.forEach((slide, idx) => {
      const slideId = `slide_${idx}_${timestamp}`;
      const titleId = `slide_title_${idx}_${timestamp}`;
      const bodyId = `slide_body_${idx}_${timestamp}`;

      requests.push({
        createSlide: {
          objectId: slideId,
          slideLayoutReference: {
            predefinedLayout: 'TITLE_AND_BODY',
          },
          placeholderIdMappings: [
            {
              layoutPlaceholder: { type: 'TITLE', index: 0 },
              objectId: titleId,
            },
            {
              layoutPlaceholder: { type: 'BODY', index: 0 },
              objectId: bodyId,
            },
          ],
        },
      });

      requests.push({
        insertText: {
          objectId: titleId,
          text: slide.title || `Concept Part ${idx + 1}`,
        },
      });

      let bodyText = slide.content && slide.content.length > 0
        ? slide.content.map((point) => `• ${point}`).join('\n')
        : '• Interactive classroom discussion\n• Hands-on application';

      if (slide.visualConcept) {
        bodyText += `\n\n💡 Visual Idea: ${slide.visualConcept}`;
      }
      if (slide.instructorNotes) {
        bodyText += `\n\nTeacher Speaking Note: "${slide.instructorNotes}"`;
      }

      requests.push({
        insertText: {
          objectId: bodyId,
          text: bodyText,
        },
      });
    });
  }

  // Slide: Hands-On Activity Slide
  const activity = lesson.handsOnActivity;
  if (activity && activity.title) {
    const actSlideId = `activity_slide_${timestamp}`;
    const actTitleId = `activity_title_${timestamp}`;
    const actBodyId = `activity_body_${timestamp}`;

    requests.push({
      createSlide: {
        objectId: actSlideId,
        slideLayoutReference: {
          predefinedLayout: 'TITLE_AND_BODY',
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: { type: 'TITLE', index: 0 },
            objectId: actTitleId,
          },
          {
            layoutPlaceholder: { type: 'BODY', index: 0 },
            objectId: actBodyId,
          },
        ],
      },
    });

    requests.push({
      insertText: {
        objectId: actTitleId,
        text: `Hands-On Activity: ${activity.title}`,
      },
    });

    const materialsText = activity.materials && activity.materials.length > 0
      ? activity.materials.map((m) => `   - ${m}`).join('\n')
      : '   - Standard class items';
    
    const stepsText = activity.steps && activity.steps.length > 0
      ? activity.steps.map((s, i) => `   ${i + 1}. ${s}`).join('\n')
      : '   1. Set up scientific materials\n   2. Perform experiments\n   3. Discuss results';

    const actText = `Get Ready for Exploration!\n\n🛠️ Materials Needed:\n${materialsText}\n\n🏃 Steps to Complete:\n${stepsText}\n\n🔬 Scientific Principle:\n${activity.scientificPrinciple || 'Active scientific reasoning'}`;

    requests.push({
      insertText: {
        objectId: actBodyId,
        text: actText,
      },
    });
  }

  // Slide: Interactive Quiz Check-in
  if (lesson.quiz && lesson.quiz.length > 0) {
    const quizSlideId = `quiz_slide_${timestamp}`;
    const quizTitleId = `quiz_title_${timestamp}`;
    const quizBodyId = `quiz_body_${timestamp}`;

    requests.push({
      createSlide: {
        objectId: quizSlideId,
        slideLayoutReference: {
          predefinedLayout: 'TITLE_AND_BODY',
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: { type: 'TITLE', index: 0 },
            objectId: quizTitleId,
          },
          {
            layoutPlaceholder: { type: 'BODY', index: 0 },
            objectId: quizBodyId,
          },
        ],
      },
    });

    requests.push({
      insertText: {
        objectId: quizTitleId,
        text: 'Concept Check-In Quiz',
      },
    });

    const quizText = lesson.quiz
      .slice(0, 3) // Limit to first 3 questions to prevent overrunning slide space
      .map((q, qIdx) => {
        const optionLetters = ['A', 'B', 'C', 'D'];
        const optionsStr = q.options && q.options.length > 0
          ? q.options.map((opt, oIdx) => `      ${optionLetters[oIdx] || '-'}. ${opt}`).join('\n')
          : '      A. True\n      B. False';
        return `Question ${qIdx + 1}: ${q.question}\n${optionsStr}`;
      })
      .join('\n\n');

    requests.push({
      insertText: {
        objectId: quizBodyId,
        text: quizText,
      },
    });
  }

  // 3. Send all updates in a single batchUpdate request
  const updateRes = await fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests,
      }),
    }
  );

  if (!updateRes.ok) {
    const errorData = await updateRes.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Failed to update presentation: ${updateRes.statusText}`
    );
  }

  return {
    presentationId,
    presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
    embedUrl: `https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false&delayms=5000`,
  };
}
