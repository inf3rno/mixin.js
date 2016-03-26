Feature: shallowMerge
  As a user of the ozone lib
  I want to use the shallowMerge function
  So I would be able to shallow merge any type of objects.

  Scenario: Shallow merging primitives fails
    When I try to merge primitives
    Then it should throw an Error, because only objects can be merged

  Scenario: Shallow merging sources without giving array fails
    When I try to merge with sources without giving an array
    Then it should throw an Error, because sources must be an array of objects

  Scenario: Shallow merge objects
    When I shallow merge an object with multiple source objects
    Then the result should be the subject
    And it should contain the properties of the sources
    And the source properties should override the subject properties
    And the source properties should override each other in the source order
    And the native methods like toString should be overridden as well