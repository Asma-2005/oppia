import { UserFactory } from '../../utilities/common/user-factory';
import testConstants from '../../utilities/common/test-constants';

const ROLES = testConstants.Roles;

describe('Manage Contributor Rights', function() {
  let rightsAdmin: any;
  let targetUser: any; // ONE user to save memory and time by reusing the same user for all rights tests.

  const ADMIN_USERNAME = 'RightsManager';
  const TARGET_USERNAME = 'TargetUser';
  
  const LANGUAGE_HINDI = 'hi'; 

  beforeAll(async function() {
    // 1. a powerful Admin with BOTH Question and Translation permissions
    rightsAdmin = await UserFactory.createNewUser(
      ADMIN_USERNAME,
      'admin@example.com',
      [ROLES.QUESTION_ADMIN, ROLES.TRANSLATION_ADMIN]
    );
    
    // 2. ONE blank user to receive all the rights
    targetUser = await UserFactory.createNewUser(TARGET_USERNAME, 'target@example.com');
  });

  it('should assign and verify question and translation rights', async function() {
    await rightsAdmin.navigateToContributorDashboardAdminPage();

    // --- QUESTION RIGHTS (QC.1) ---
    await rightsAdmin.addSubmitQuestionRights(TARGET_USERNAME);
    await rightsAdmin.verifyUserCanSubmitQuestions(TARGET_USERNAME);

    await rightsAdmin.addReviewQuestionRights(TARGET_USERNAME);
    await rightsAdmin.verifyUserCanReviewQuestions(TARGET_USERNAME);
    
    await rightsAdmin.removeSubmitQuestionRights(TARGET_USERNAME);
    await rightsAdmin.verifyUserCannotSubmitQuestions(TARGET_USERNAME);
    
    await rightsAdmin.removeReviewQuestionRights(TARGET_USERNAME);
    await rightsAdmin.verifyUserCannotReviewQuestions(TARGET_USERNAME);

    // --- TRANSLATION RIGHTS (TC.1) ---
    await rightsAdmin.addTranslationLanguageReviewRights(TARGET_USERNAME, LANGUAGE_HINDI);
    await rightsAdmin.viewContributorTranslationRightsByLanguageCode(LANGUAGE_HINDI);
    await rightsAdmin.expectUserToBeDisplayed(TARGET_USERNAME);

    await rightsAdmin.removeTranslationLanguageReviewRights(TARGET_USERNAME, LANGUAGE_HINDI);
    await rightsAdmin.viewContributorTranslationRightsByLanguageCode(LANGUAGE_HINDI);
    await rightsAdmin.expectUserToNotBeDisplayed(TARGET_USERNAME);
  });

  afterAll(async function() {
    await UserFactory.closeAllBrowsers();
  });
});