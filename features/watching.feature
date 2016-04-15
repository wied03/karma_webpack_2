Feature: file watching

  Scenario: New spec added
    Given the 'passing' tests
    And the simple.js Karma config file
    And I run the Karma test and keep Karma running
    And the test passes
    When I add a new spec file and wait
    Then the test passes with JSON results:
    """
    {
        "A suite": {
            "contains spec with an expectation": "PASSED",
            "contains spec 2 with an expectation": "PASSED"
        }
    }
    """

  Scenario: Entry point changes
    Given the 'passing' tests
    And the simple.js Karma config file
    And I run the Karma test and keep Karma running
    And the test passes
    When I add a new spec to the entry point and wait
    Then the test passes with JSON results:
    """
    {
        "A suite": {
            "contains spec with an expectation": "PASSED",
            "contains spec 2 with an expectation": "PASSED"
        }
    }
    """

  Scenario: Source maps from JS
    Given the 'passing' tests
    And the source_maps_avail.js Karma config file
    And I run the Karma test and keep Karma running
    And the test passes
    When I add a new spec that queries source maps and wait
    Then the test passes with JSON results:
    """
    {
        "A suite": {
            "contains spec with an expectation": "PASSED",
            "contains spec 2 with a source map query": "PASSED"
        }
    }
    """

  Scenario: Source maps in results
    Given the 'passing' tests
    And the source_maps_result.js Karma config file
    And I run the Karma test and keep Karma running
    And the test passes
    When I add a failing source mapped spec file and wait
    Then the test fails
    And the Karma output contains 'webpack:///test/dependency.rb:5:11'
