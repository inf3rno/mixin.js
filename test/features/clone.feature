Feature: clone
  As a user of the ozone lib
  I want to use the clone function
  So I would be able to clone any type of variables.

  Scenario: Clone object with clone method
    When I clone an object having a clone method
    Then the result of the clone method should be returned

  Scenario: Clone variable without clone method
    When I clone a variable which does not have a clone method
    Then the shallow cloned variable should be returned