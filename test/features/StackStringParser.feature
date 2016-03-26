Feature: StackStringParser
  As a user of the ozone lib
  I want to use a stack string parser
  To make an uniform stack format from the string representation of node.js

  Scenario: parsing stack string
    When I parse a stack string
    Then the result should be a StackTrace
    And it should contain the StackFrames with the description, path, row, col properties
