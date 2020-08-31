$(document).ready(() => {

  // Header animation when scrolling 
  const header__main = $('.header__main'); // Wrapper header_logo and header__nav__menu
  const header_height = getHeight($('header')); 
  const nav_height = getHeight(header__main);
  const blocksArr = ['#aboutUs', '#gallery', '#latestNews', '#contacts-block'];


  $(window).on('scroll', () => {
    if ($(window).scrollTop() > header_height - nav_height) {
      header__main.addClass('header__main_scroll');
      header__main.parent().removeClass('wrapper');
    } else {
      header__main.removeClass('header__main_scroll');
      header__main.parent().addClass('wrapper');
    }

    // Animates circles of navigation items in header__nav__menu
    $.each(blocksArr, (index, value) => {
      const scrollTop_startBlock = $(value).offset().top - nav_height;
      const scrollTop_endBlock = $(value).offset().top + $(value)[0].clientHeight - nav_height;

      if (scrollTop_startBlock <= $('html, body').scrollTop() &&
        scrollTop_endBlock >= $('html, body').scrollTop()) {
        checkActiveState(value);
      }
    });
  });


  // Gets the height of the block
  // return - height of the block
  function getHeight(obj) {
    const height = parseInt(obj
      .css('height')
      .substring(0, $(obj).css('height').length - 2));
    return height;
  }

  // Checks if the target block has an 'active' class and if it is absent then
  // add it
  function checkActiveState(obj) {
    const active_block = $('span[class~=active]');
    const circle_target = $('a[href="' + obj + '"]').children('span');
    if (!circle_target.hasClass('active')) {
      active_block.removeClass('active');
      circle_target.addClass('active');
    }
  }


  // Nav animation when clicking nav-item
  $('.header__nav__menu-item > a').on('click', function() {
    event.preventDefault();
    const selector = $(this).attr('href');
    $('html, body').animate({
      scrollTop: ($(selector).offset().top - nav_height)
    }, 1000);

    const active_block = $('span[class~=active]');
    const circle_target = $(this).children('span');
    if (!circle_target.hasClass('active')) {
      active_block.removeClass('active');
      circle_target.addClass('active');
    }
  });






});