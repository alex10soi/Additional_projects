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

      if (scrollTop_startBlock - 1 <= $('html, body').scrollTop() &&
        scrollTop_endBlock - 1 >= $('html, body').scrollTop()) {
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

  // ----------------
  // Slider in header
  
  const first_slider_item = $('.header__slider-item-1');
  const num_slider_items = $('.header__slider-item').length;
  const slider_item_height = $('.header__slider-item-1')[0].clientHeight;
  const slider_height = slider_item_height * num_slider_items;

  // Animates a block with the class '.header__slider__nextItem-link',
  //  which is triggered on click, moving the slider to the next item,
  //   and also synchronizes each item of the slider with the items of 
  //   the class '.header__slider__list'
  $('.header__slider__nextItem-link').on('click', () => {
    const marginTop_slider_item_1 = getMarginTop($('.header__slider-item-1'));
    const active_item = $('.header__slider__list > div.active');

    if(marginTop_slider_item_1 < slider_height - slider_item_height) {
      first_slider_item.animate({'margin-top': '-=' + slider_item_height}, 800);
      active_item.removeClass('active').next().addClass('active');
    } else {
      first_slider_item.animate({'margin-top': 0}, 800);
      active_item.removeClass('active');
      $('.header__slider__list > div:first-child').addClass('active');
    } 
  });


  // Animates items using the .header__slider__list-item class, 
  // which fires when clicked, moving the slider to the next slider item,
  //  and also synchronizes each slider item with the ‘.header__slider__list’ items.
  $('.header__slider__list-item').on('click', (event) => {
    const pos_slider_item = $(event.target).attr('value');
    const active_slider_list_item = $('.header__slider__list > div.active');
    const marginTop_target = (pos_slider_item - 1) * slider_item_height;

    first_slider_item.animate({'margin-top': '-' + marginTop_target}, 800);
      active_slider_list_item.removeClass('active');
      $(event.target).addClass('active');
  });


  // Gets the margin-top value of the first slider item in the header
  function getMarginTop (obj) {
    const marginTop = Math.abs(parseInt(obj
      .css('margin-top')
      .substring(0, $(obj).css('margin-top').length - 2)));
    return marginTop;
  }


  // Slick Slider launch
  $('.latestNews_slider').slick({
    dots: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    variableWidth: true,
    pauseOnHover: true,
    nextArrow: '<div class="nextArrow"><i class="fas fa-chevron-right"></i></div>',
    prevArrow: '<div class="prevArrow"><i class="fas fa-chevron-left"></i></div>',
  });

  
  // Height of the latestNews_slider-card
  let slider_card_height = 0;

  // Aligns the height of the card when resizing the browser window
  $(window).resize(function(event) {
    $('.latestNews_slider-card').each( (index, el) => { 
      if(slider_card_height < $(el)[0].clientHeight) {
        slider_card_height = $(el)[0].clientHeight;
      }
    });

    $('.latestNews_slider-card').each( (index, el) => {
      $(el).css('height', slider_card_height + 'px');
    });
  });
});