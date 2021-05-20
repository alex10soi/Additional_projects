$(document).ready(() => {
  //----------------Animates Footer_Menu_Button---------------
  const footer = $('footer');
  $('.footer_menu_icon').on('click', function() {
    $(this).css('display', 'none');
    footer.css('display', 'block');
    footer.animate({ 'width': '100%' }, 1000);
  });

  footer.on('mouseleave', function() {
    footer.animate({ 'width': '0' }, 1000, function() {
      footer.css('display', 'none');
      setTimeout(function() {
        $('.footer_menu_icon').css('display', 'block');
      }, 200);
    });
  });

  //------------------------- Add copyright ----------------------------
  const authorName = 'Aleksandr Saiko';
  let copyright = $('.footer_copyright').text() + ' ' + new Date().getFullYear();
  $('.footer_copyright').text(copyright + ' ' + authorName);


  // ---------------- Animates Calculator Buttons ----------------------
  // Checks the value of the button pressed by the user and invokes the 
  // set action on it
  let btnValue;
  $('.btn').on('click', function(event) {
    if ($(event.target)[0].id == 'resultButton') {
      $(this).css('box-shadow', '0 0 2px 2px rgba(255, 221, 89,1.0)');
      setTimeout(() => {
        $(this).css('box-shadow', '0 0 0 0 rgba(255, 221, 89,1.0)');
      }, 300);
    } else {
      $(event.target).css('box-shadow', '0 0 2px 2px rgba(149, 165, 166,1.0)');
      setTimeout(() => {
        $('.btn').css('box-shadow', '0 0 0 0 rgba(149, 165, 166,1.0)');
      }, 300);
    }
    btnValue = $(this).text();
    checkButton(btnValue);
  });


  // Checks the pressed button and selects a code block according to its functionality
  function checkButton(btnValue) {
    switch (btnValue) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
      case '00':
      case '-':
      case '+':
      case '*':
      case '.':
      case '/':
        $('#calc').val($('#calc').val() + btnValue);
        break;
      case 'C':
        $('#calc').val('');
        break;
      case '<':
        let itemValue = $('#calc').val();
        itemValue = itemValue.substring(0, itemValue.length - 1);
        $('#calc').val(itemValue);
        break;
      default:
        break;
    }
  }

  //----------------------------------------------------------------//
  // -----------------Calculator code block-------------------------//

  // Variables for the first and second numbers in the actions of the calculator
  let numOne, numSecond;
  let arrNumbers = [], arrOperand = [];

  $('#resultButton').on('click', function() {
    runApp();
  });

  $(window).on('keydown', (event) => {
    if (event.which === 13) {
      runApp();
    }
  });


  //Calculation result
  let result;

  //Button 'C' of calculator
  const btnReset = $('#itemC'); 


  //Launches a calculator program
  function runApp() {
    const str = $('#calc').val();
    const patt = /^([\-]?\d*([\.]{1}\d*)?)([+\-*\/]*\d*([\.]{1}\d*)?)*$/;
    if (patt.test(str) && /[^\-+*\/]$/.test(str) && !(/(\-[*\/]{1,})|(\+[*\/]{1,})/.test(str))) {
      result = parsingStr(str);
      if (/\./.test(result)) {
        let index = result.toString().indexOf('.');
        if (result.toString().substring(index).length > 4) {
          result = result.toFixed(4);
        }
      }
    } else {
      $('#calc').val('Ошибка');
      return;
    }

    // Displaying the final result on the screen
    $('#calc').val(result);
  }

  //Counts the result
  function calc(operand) {
    switch (operand) {
      case '/':
        result = numOne / numSecond;
        break;
      case '*':
        result = numOne * numSecond;
        break;
      case '-':
        result = numOne - numSecond;
        break;
      case '+':
        result = numOne + numSecond;
        break;
    }
    return result;
  }

  // Indicates whether the character [- + / *] occurred immediately before 
  // the current character [- + / *], if such a character was then flag = true
  let flag = false;

  // Parses a line defining the entered request from the user. 
  //The limit for the calculator is two entered numbers at a time.
  function parsingStr(str) {
    let num = '';
    for (var i = 0; i < str.length; i++) {
      if (i == 0 && str.charAt(i) === '-') {
        num += str.charAt(i);
        continue;
      } else if (/[0-9]/.test(str.charAt(i))) {
        if (num.length === 0 && flag === true) {
          flag = !flag;
        }
        num += str.charAt(i);
      } else if (/[\.]/.test(str.charAt(i))) {
        if (num.length !== 0 && flag === true) {
          flag = !flag;
        }
        num += str.charAt(i);
      } else if (/[\-]/.test(str.charAt(i)) && flag) {
        num += str.charAt(i);
        flag = !flag;
      } else if (/[+\-*\/]/.test(str.charAt(i)) && !flag && num.length > 0) {
        arrNumbers.push(num);
        num = '';
        flag = !flag;
        if (arrOperand.length === 0) {
          arrOperand.push(str.charAt(i));
          continue;
        } else {
          if (getPriority(str.charAt(i)) > getPriority(arrOperand[arrOperand.length - 1])) {
            arrOperand.push(str.charAt(i));
            continue;
          } else if (getPriority(str.charAt(i)) < getPriority(arrOperand[arrOperand.length - 1])) {
            while (arrOperand.length > 0 && getPriority(str.charAt(i)) < getPriority(arrOperand[arrOperand.length - 1])) {
              launchCalc();
            }
          } else {
            while (arrOperand.length > 0 && getPriority(str.charAt(i)) == getPriority(arrOperand[arrOperand.length - 1])) {
              launchCalc()
            }
          }
          arrOperand.push(str.charAt(i));
        }
      }

      if (i == str.length - 1) {
        arrNumbers.push(num);
        if (getPriority(arrOperand[arrOperand.length - 1]) === 3) {
          while (getPriority(arrOperand[arrOperand.length - 1]) === 3) {
            launchCalc()
          }
        }
      }
    }

    const arrSize = arrOperand.length;
    for (let i = 0; i < arrSize; i++) {
      numOne = parseFloat(arrNumbers.shift());
      numSecond = parseFloat(arrNumbers.shift());
      arrNumbers.unshift(calc(arrOperand.shift()));
    }
    result = arrNumbers[0];
    arrNumbers.pop();
    return result;
  }

  // Prepares variables for the calculator and runs it for one operation 
  // according to the current action with numbers
  function launchCalc() {
    numSecond = parseFloat(arrNumbers.pop());
    numOne = parseFloat(arrNumbers.pop());
    arrNumbers.push(calc(arrOperand.pop()));
  }

  // Returns character priority
  function getPriority(char) {
    if (/[0-9]/.test(char)) {
      return 1;
    } else if (/[+\-]/.test(char)) {
      return 2;
    } else if (/[*\/]/.test(char)) {
      return 3;
    }
  }
});


// --------------The appearance of the calculator------------------
// on the screen and its hiding from the screen when you select 
// another menu item is not a calculator.

$('.header_menu_list > a').on('click', function() {
  if($(this).text() === 'Calculator'){
		$('.calculator').fadeIn(2000);
	}else {
		$('.calculator').fadeOut(2000);
	}
});