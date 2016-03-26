Feature: shallowClone
  As a user of the ozone lib
  I want to use the shallowClone function
  So I would be able to shallow clone any type of variables.

  Scenario: Shallow clone primitives
    When I clone primitives
    Then the result should be the same value

  Scenario: Shallow clone Arrays
    When I clone an Array
    Then the result should be a new Array with the same items

  Scenario: Shallow clone Dates
    When I clone a Date
    Then the result should be a new Date with the same time

  Scenario: Shallow clone RegExp objects
    When I clone a RegExp
    Then the result should be a new RegExp with the same pattern and flags

  Scenario: Shallow clone Objects
    When I clone an Object
    Then the result should be a new Object which inherits the properties of the original one

