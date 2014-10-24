angular.module('model')
  .filter('NodeType', function() {
    return function(input, nodeType) {
      var filtered = [];
      for (var i = 0; i < input.length; i++) {
        if (input[i].get('nodeType')===nodeType) {
          filtered.push(input[i]);
        }
      }
      return filtered;
    };
  });
