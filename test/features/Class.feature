Feature: Class
  As a user of the ozone lib
  I want to use classes
  So programming object-oriented will be easier

  Scenario: Inheritance
    Given an Ancestor
    When I clone the Ancestor
    And I instantiate the Descendant
    Then the Descendant should inherit the properties of the Ancestor
    And the instance of the Descendant should be the instance of the Ancestor
    But not the instance of some RandomClass

  Scenario: Inheritance with custom cloning algorithm
    Given an Ancestor with custom cloning algorithm
    When I clone the Ancestor
    And I instantiate the Descendant
    And I clone the instance
    Then the Descendant should inherit the properties of the Ancestor by using the custom cloning algorithm
    And the instantiation should trigger the custom cloning algorithm
    And the instance cloning should trigger the custom cloning algorithm as well

  Scenario: Adding new properties
    Given a class
    When I add new properties
    Then the class should contain the new properties
    And the inherited properties of the class should be overridden with the new ones

  Scenario: Adding new properties with custom merging algorithm
    Given a class with custom merging algorithm
    When I add new properties
    Then the class should use the custom merging algorithm to add the new properties

  Scenario: Instantiating the abstract base Class is not possible
    When I try to instantiate the base Class
    Then it should throw an Error, because of abstract class instantiation

  Scenario: Instantiation with parameters adds properties to the instance
    Given a class
    When I instantiate the class
    Then the instantiation with parameters should add new properties to the instance by default

  Scenario: Instantiation with custom initialization algorithm
    Given a class with custom initialization algorithm
    When I instantiate the class
    Then the instantiation with parameters should trigger the custom initialization algorithm
    And the default behavior which is adding new properties to the instance should not run
