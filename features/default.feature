Feature: default

  Scenario: Standard case passes
    Given the 'passing' tests
    And the simple.js Karma config file
    When I run the Karma test
    Then the test passes with JSON results:
    """
    {
        "A suite": {
            "contains spec with an expectation": "PASSED"
        }
    }
    """
    And webpack logged informational messages

  Scenario: Existing webpack bundle
    Given the 'passing' tests
    And an existing webpack bundle
    And the simple.js Karma config file
    When I run the Karma test
    Then the existing webpack bundle is left intact

  Scenario: Another loader
    Given the 'opal' tests
    And the opal.js Karma config file
    When I run the Karma test
    Then the test passes with JSON results:
    """
    {
        "A suite": {
            "contains spec with an expectation": "PASSED"
        }
    }
    """

  Scenario: Test fails
    Given the 'failing' tests
    And the simple.js Karma config file
    When I run the Karma test
    Then the test fails with JSON results:
    """
    {
        "A suite": {
            "contains spec with an expectation": "FAILED"
        }
    }
    """

  Scenario: Source maps enabled in result
    Given the 'opal_fail' tests
    And the source_maps_result.js Karma config file
    When I run the Karma test
    Then the test fails
    And the Karma output contains 'webpack:///test/dependency.rb:4:2'

  Scenario: Source maps available
    Given the 'opal_fail' tests
    And the source_maps_avail.js Karma config file
    When I run the Karma test
    Then the test fails
    And the Karma output does not contain 'webpack:///test/dependency.rb:4:2'
    And the following source maps exist:
    | File                    | Map URL          | Original File           | Sources                 |
    | /base/spec/main_spec.js | main_spec.js.map | /base/spec/main_spec.js | /base/spec/main_spec.rb |

  Scenario: Handles webpack compilation errors
    Given a complete scenario
