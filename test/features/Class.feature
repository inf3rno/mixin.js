Feature: Class
  As a user of the ozone lib
  I want to use classes
  So programming object-oriented will be easier

  Scenario: Class inheritance
    Given an ancestor class
    When I extend the ancestor class
    Then I should get a descendant class
    And the descendant inherits properties and methods of the ancestor