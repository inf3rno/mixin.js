Feature: toArray
  As a user of the ozone lib
  I want to use the toArray function
  So I would be able to convert a value into an Array

  Scenario: Converting an arguments collection
    When I call toArray on an arguments object
    Then an Array containing each argument should be returned

  Scenario: Converting an instance with a toArray method
    When I call toArray on an Object
    Then the result should be the enumerable property values of the Object

  Scenario: Converting an Object with a toArray method
    When I call toArray on an Object with a toArray method
    Then the result should be the return value of that toArray method

  Scenario: Cloning an Array
    When I call toArray on an Array
    Then I should get the copy of that Array

  Scenario: Converting primitives is not possible
    When I call toArray on a primitive
    Then it should throw an Error, because of the invalid argument

  Scenario: Converting functions is not possible
    When I call toArray on a Function
    Then it should throw an Error, because of the invalid argument
