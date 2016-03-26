Feature: merge
  As a user of the ozone lib
  I want to use the merge function
  So I would be able to merge any type of variables.

  Scenario: Merge object with merge method
    When I merge an object having a merge method
    Then the merge method should be called on the object with the sources

  Scenario: Merge variable without merge method
    When I merge a variable which does not have a merge method
    Then shallow merge should be called on the variable with the sources