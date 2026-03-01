// Copyright 2026 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Acceptance tests for managing contributor rights. from internal users DOC 
 * https://docs.google.com/spreadsheets/d/1DIZ0_Gmf9uhjTbhuDpA495PTjYZW9ZE97r6urS-iXwg/edit?gid=888982708#gid=888982708
 */

import { UserFactory } from '../../utilities/common/user-factory';
import testConstants from '../../utilities/common/test-constants';
import { QuestionAdmin } from '../../utilities/user/question-admin';
import { TranslationAdmin } from '../../utilities/user/translation-admin';

const ROLES = testConstants.Roles;

describe('Manage Contributor Rights', function() {
  let rightsAdmin: QuestionAdmin & TranslationAdmin;

  const ADMIN_USERNAME = 'RightsManager';
  const TARGET_USERNAME = 'TargetUser';
  const LANGUAGE_HINDI = 'hi';

  beforeAll(async function() {
    // Create a powerful Admin with both Question and Translation permissions.
    rightsAdmin = await UserFactory.createNewUser(
      ADMIN_USERNAME,
      'admin@example.com',
      [ROLES.QUESTION_ADMIN, ROLES.TRANSLATION_ADMIN]
    ) as QuestionAdmin & TranslationAdmin;

    // ONE user to save memory and time by reusing the same user for all rights tests.
    await UserFactory.createNewUser(TARGET_USERNAME, 'target@example.com');
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
    await rightsAdmin.addTranslationLanguageReviewRights(
      TARGET_USERNAME, LANGUAGE_HINDI);
    await rightsAdmin.viewContributorTranslationRightsByLanguageCode(
      LANGUAGE_HINDI);
    await rightsAdmin.expectUserToBeDisplayed(TARGET_USERNAME);

    await rightsAdmin.removeTranslationLanguageReviewRights(
      TARGET_USERNAME, LANGUAGE_HINDI);
    await rightsAdmin.viewContributorTranslationRightsByLanguageCode(
      LANGUAGE_HINDI);
    await rightsAdmin.expectUserToNotBeDisplayed(TARGET_USERNAME);
  });

  afterAll(async function() {
    await UserFactory.closeAllBrowsers();
  });
});