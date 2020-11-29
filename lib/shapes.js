/**
 * Define action to add shape to canvas
 */
(function () {
  'use strict';
  const defaultShapes = [
    `<svg viewBox="-10 -10 120 120"><polygon points="0 0, 0 100, 100 100, 100 0" stroke-width="8" stroke="#000" fill="none"></polygon></svg>`,
    `<svg viewBox="-8 -8 120 120"><polygon fill="none" stroke-width="8" stroke="black" points="50 0, 85 50, 50 100, 15 50"></polygon></svg>`,
    `<svg viewBox="-10 -10 120 120"><polygon points="25 0, 0 100, 75 100, 100 0" stroke-width="8" stroke="#000" fill="none"></polygon></svg>`,
    `<svg viewBox="-8 -8 120 120"><polygon points="0,100 30,10 70,10 100,100" stroke-width="8" stroke="#000" fill="none"></polygon></svg>`,
    `<svg viewBox="-10 -10 120 120"><path d="M 80,80 V 20 H 20 v 60 z m 20,20 V 0 H 0 v 100 z" stroke-width="8" stroke="#000" fill-rule="evenodd" fill="none"></path></svg>`,
    `<svg viewBox="0 0 100 100"><polygon points="26,86 11.2,40.4 50,12.2 88.8,40.4 74,86 " stroke="#000" stroke-width="8" fill="none"></polygon></svg>`,
    `<svg viewBox="0 0 100 100"><polygon points="30.1,84.5 10.2,50 30.1,15.5 69.9,15.5 89.8,50 69.9,84.5" stroke-width="8" stroke="#000" fill="none"></polygon></svg>`,
    `<svg viewBox="0 0 100 100"><polygon points="34.2,87.4 12.3,65.5 12.3,34.5 34.2,12.6 65.2,12.6 87.1,34.5 87.1,65.5 65.2,87.4" stroke-width="8" stroke="#000" fill="none"></polygon></svg>`,
    `<svg viewBox="0 0 100 100"><polygon points="11.2,70 11.2,40 50,12.2 88.8,40 88.8,70" stroke="#000" stroke-width="8" fill="none"></polygon></svg>`,
    `<svg viewBox="0 0 100 100"><polygon points="10.2,70 10.2,35 30.1,15 69.9,15 89.8,35 89.8,70" stroke-width="8" stroke="#000" fill="none"></polygon></svg>`,
    `<svg viewBox="-10 -10 120 120"><polygon points="50 15, 100 100, 0 100" stroke-width="8" stroke="#000" fill="none"></polygon></svg>`,
    `<svg viewBox="-10 -10 120 120"><polygon points="0 0, 100 100, 0 100" stroke-width="8" stroke="#000" fill="none"></polygon></svg>`,
    `<svg viewBox="-10 -10 120 120"><path d="M 26,85 50,45 74,85 Z m -26,15 50,-85 50,85 z" stroke-width="8" stroke="#000" fill="none"></path></svg>`,
    `<svg viewBox="8 50 100 100"><path d="M 62.68234,131.5107 H 26.75771 V 96.075507 Z M 11.572401,146.76255 V 59.66782 l 87.983665,87.09473 z" stroke-width="8" stroke="#000" fill="none" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-2 -2 100 100"><circle cx="50" cy="50" r="40" stroke="#000" stroke-width="8" fill="none"></circle></svg>`,
    `<svg x="0px" y="0px" viewBox="0 0 96 120" xml:space="preserve"><path stroke="#000" stroke-width="8" fill="none" d="M9.113,65.022C11.683,45.575,28.302,30.978,48,30.978c19.696,0,36.316,14.598,38.887,34.045H9.113z"></path></svg>`,
    `<svg viewBox="-15 -15 152 136"><path stroke="#000000" stroke-width="8" d="m0 0l57.952755 0l0 0c32.006428 -1.4055393E-14 57.952755 23.203636 57.952755 51.82677c0 28.623135 -25.946327 51.82677 -57.952755 51.82677l-57.952755 0z" fill="none"></path></svg>`,
    `<svg viewBox="-5 -50 140 140"><path stroke="#000000" stroke-width="8" d="m20.013628 0l84.37401 0l0 0c11.053215 -1.04756605E-14 20.013626 9.282301 20.013626 20.7326c0 11.450296 -8.960411 20.7326 -20.013626 20.7326l-84.37401 0l0 0c-11.053222 0 -20.013628 -9.282303 -20.013628 -20.7326c-5.2380687E-15 -11.450298 8.960406 -20.7326 20.013628 -20.7326z" fill="none"></path></svg>`,
    `<svg viewBox="-8 -8 136 136"><path stroke="#000000" stroke-width="8" d="m0 51.82677l0 0c0 -28.623135 23.203636 -51.82677 51.82677 -51.82677l0 0c13.745312 0 26.927654 5.4603047 36.64706 15.17971c9.719406 9.719404 15.17971 22.901749 15.17971 36.64706l0 0c0 28.623135 -23.203636 51.82677 -51.82677 51.82677l0 0c-28.623135 0 -51.82677 -23.203636 -51.82677 -51.82677zm25.913385 0l0 0c0 14.311565 11.60182 25.913387 25.913385 25.913387c14.311565 0 25.913387 -11.601822 25.913387 -25.913387c0 -14.311565 -11.601822 -25.913385 -25.913387 -25.913385l0 0c-14.311565 0 -25.913385 11.60182 -25.913385 25.913385z" fill="none"></path></svg>`,
    `<svg viewBox="-7 -35 133 105"><path stroke="#000000" stroke-width="8" d="m0 57.952755l0 0c0 -32.006424 25.946333 -57.952755 57.952755 -57.952755c32.006428 0 57.952755 25.946333 57.952755 57.952755l-28.97638 0c0 -16.003212 -12.97316 -28.976377 -28.976376 -28.976377c-16.003212 0 -28.976377 12.9731655 -28.976377 28.976377z" fill="none"></path></svg>`,
    `<svg viewBox="-10 -10 150 150" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linejoin="round" stroke-linecap="butt" d="m0 51.82677l42.665005 -9.161766l9.161766 -42.665005l9.161766 42.665005l42.665005 9.161766l-42.665005 9.161766l-9.161766 42.665005l-9.161766 -42.665005z" fill-rule="evenodd" fill="none"></path></svg>`,
    `<svg viewBox="-15 -15 137 130"><path stroke="#000000" stroke-width="8" d="m1.09633125E-4 37.631077l39.59224 2.632141E-4l12.234421 -37.63134l12.234425 37.63134l39.59224 -2.632141E-4l-32.030952 23.257183l12.234924 37.631172l-32.030636 -23.257607l-32.03064 23.257607l12.234926 -37.631172z" fill="none"></path></svg>`,
    `<svg viewBox="-10 -10 150 150" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linejoin="round" stroke-linecap="butt" d="m0 59.82677l27.527777 -8.654488l-19.512508 -21.258898l28.167 6.268881l-6.268881 -28.167l21.258898 19.512508l8.654488 -27.527777l8.654491 27.527777l21.258896 -19.512508l-6.2688828 28.167l28.167 -6.268881l-19.512512 21.258898l27.527779 8.654488l-27.527779 8.654491l19.512512 21.258896l-28.167 -6.2688828l6.2688828 28.167l-21.258896 -19.512512l-8.654491 27.527779l-8.654488 -27.527779l-21.258898 19.512512l6.268881 -28.167l-28.167 6.2688828l19.512508 -21.258896z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -10 150 150" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linejoin="round" stroke-linecap="butt" d="m0 59.82677l33.496998 -3.4664993l-31.45845 -12.017807l33.252647 5.321434l-27.275928 -19.750513l30.742428 13.746485l-21.234838 -26.137014l26.137014 21.234838l-13.746485 -30.742428l19.750513 27.275928l-5.321434 -33.252647l12.017807 31.45845l3.4664993 -33.496998l3.4664993 33.496998l12.017811 -31.45845l-5.321434 33.252647l19.750511 -27.275928l-13.746483 30.742428l26.137009 -21.234838l-21.234833 26.137014l30.742424 -13.746485l-27.275925 19.750513l33.252647 -5.321434l-31.45845 12.017807l33.496994 3.4664993l-33.496994 3.4664993l31.45845 12.017811l-33.252647 -5.321434l27.275925 19.750511l-30.742424 -13.746483l21.234833 26.137009l-26.137009 -21.234833l13.746483 30.742424l-19.750511 -27.275925l5.321434 33.252647l-12.017811 -31.45845l-3.4664993 33.496994l-3.4664993 -33.496994l-12.017807 31.45845l5.321434 -33.252647l-19.750513 27.275925l13.746485 -30.742424l-26.137014 21.234833l21.234838 -26.137009l-30.742428 13.746483l27.275928 -19.750511l-33.252647 5.321434l31.45845 -12.017811z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -10 150 150" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linejoin="round" stroke-linecap="butt" d="m0 59.82677l9.952638 -6.5662766l-7.91409 -8.91803l11.312678 -3.7663116l-5.3359585 -10.662767l11.902236 -0.7101288l-2.3946476 -11.680401l11.680401 2.3946476l0.7101288 -11.902236l10.662767 5.3359585l3.7663116 -11.312678l8.91803 7.91409l6.5662766 -9.952638l6.5662804 9.952638l8.91803 -7.91409l3.7663116 11.312678l10.6627655 -5.3359585l0.7101288 11.902236l11.680397 -2.3946476l-2.3946457 11.680401l11.902237 0.7101288l-5.3359604 10.662767l11.312683 3.7663116l-7.914093 8.91803l9.952637 6.5662766l-9.952637 6.5662804l7.914093 8.91803l-11.312683 3.7663116l5.3359604 10.6627655l-11.902237 0.7101288l2.3946457 11.680397l-11.680397 -2.3946457l-0.7101288 11.902237l-10.6627655 -5.3359604l-3.7663116 11.312683l-8.91803 -7.914093l-6.5662804 9.952637l-6.5662766 -9.952637l-8.91803 7.914093l-3.7663116 -11.312683l-10.662767 5.3359604l-0.7101288 -11.902237l-11.680401 2.3946457l2.3946476 -11.680397l-11.902236 -0.7101288l5.3359585 -10.6627655l-11.312678 -3.7663116l7.91409 -8.91803z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -40 140 140" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linejoin="round" stroke-linecap="butt" d="m0 14.960629l89.732285 0l0 -14.960629l29.921257 29.921259l-29.921257 29.921259l0 -14.9606285l-89.732285 0z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -60 180 180" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linecap="butt" d="m0 32.238846l27.590551 -27.590551l0 13.795275l82.80315 0l0 -13.795275l27.590553 27.590551l-27.590553 27.59055l0 -13.795273l-82.80315 0l0 13.795273z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -10 150 150" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linecap="butt" d="m0.005249344 89.74016l29.913385 -29.913387l0 14.956692l44.87008 0l0 -44.87008l-14.956692 0l29.913387 -29.913385l29.913383 29.913385l-14.956688 0l0 74.78347l-74.78347 0l0 14.956688z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -20 200 200" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linecap="butt" d="m0.005249344 89.74016l29.913385 -29.913387l0 14.956692l40.35827 0l0 -44.87008l-14.956692 0l29.913387 -29.913385l29.913383 29.913385l-14.956688 0l0 44.87008l40.35826 0l0 -14.956692l29.913391 29.913387l-29.913391 29.913383l0 -14.956688l-110.62992 0l0 14.956688z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -10 150 150" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linecap="butt" d="m0.005249344 59.82677l26.922047 -19.30849l0 9.424511l23.020744 0l0 -23.020744l-9.424511 0l19.30849 -26.922047l19.30849 26.922047l-9.424507 0l0 23.020744l23.020744 0l0 -9.424511l26.922043 19.30849l-26.922043 19.30849l0 -9.424507l-23.020744 0l0 23.020744l9.424507 0l-19.30849 26.922043l-19.30849 -26.922043l9.424511 0l0 -23.020744l-23.020744 0l0 9.424507z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -10 158 136" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linecap="butt" d="m0 77.22078l81.043304 0l0 -51.480316l-12.870079 0l25.740158 -25.740158l25.740158 25.740158l-12.870079 0l0 77.220474l-106.78346 0z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -10 136 136" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linecap="butt" d="m0 102.96063l0 -57.915356l0 0c0 -24.87782 20.167458 -45.045277 45.045277 -45.045277l0 0l0 0c11.946751 0 23.404194 4.7458277 31.851818 13.193456c8.447632 8.447627 13.193459 19.905071 13.193459 31.851822l0 6.4350395l12.870079 0l-25.740158 25.740158l-25.740158 -25.740158l12.870079 0l0 -6.4350395c0 -10.661922 -8.643196 -19.305119 -19.305119 -19.305119l0 0l0 0c-10.661922 0 -19.305119 8.643196 -19.305119 19.305119l0 57.915356z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -10 180 180" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linecap="butt" d="m0 0l25.742783 0l0 0l38.614174 0l90.09974 0l0 52.74803l0 0l0 22.6063l0 15.070862l-90.09974 0l-61.5304 52.813744l22.916225 -52.813744l-25.742783 0l0 -15.070862l0 -22.6063l0 0z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="-10 -10 180 180" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><path stroke="#000000" stroke-width="8" stroke-linejoin="round" stroke-linecap="butt" d="m1.0425826 140.35696l25.78009 -49.87359l0 0c-30.142242 -17.309525 -35.62507 -47.05113 -12.666686 -68.71045c22.958385 -21.65932 66.84442 -28.147947 101.387596 -14.990329c34.543175 13.1576185 48.438576 41.655407 32.10183 65.83693c-16.336761 24.181526 -57.559166 36.132935 -95.233955 27.61071z" fill-rule="evenodd"></path></svg>`,
    `<svg viewBox="0 -5 100 100" x="0px" y="0px"><path fill="none" stroke="#000" stroke-width="8" d="M55.2785222,56.3408313 C51.3476874,61.3645942 45.2375557,64.5921788 38.3756345,64.5921788 C31.4568191,64.5921788 25.3023114,61.3108505 21.3754218,56.215501 C10.6371566,55.0276798 2.28426396,45.8997866 2.28426396,34.8156425 C2.28426396,27.0769445 6.35589452,20.2918241 12.4682429,16.4967409 C14.7287467,7.0339786 23.2203008,0 33.3502538,0 C38.667844,0 43.5339584,1.93827732 47.284264,5.14868458 C51.0345695,1.93827732 55.9006839,0 61.2182741,0 C73.0769771,0 82.6903553,9.6396345 82.6903553,21.5307263 C82.6903553,22.0787821 82.6699341,22.6220553 82.629813,23.1598225 C87.1459866,27.1069477 90,32.9175923 90,39.396648 C90,51.2877398 80.3866218,60.9273743 68.5279188,60.9273743 C63.5283115,60.9273743 58.9277995,59.2139774 55.2785222,56.3408313 L55.2785222,56.3408313 Z M4.79695431,82 C7.44623903,82 9.59390863,80.6668591 9.59390863,79.0223464 C9.59390863,77.3778337 7.44623903,76.0446927 4.79695431,76.0446927 C2.1476696,76.0446927 0,77.3778337 0,79.0223464 C0,80.6668591 2.1476696,82 4.79695431,82 Z M13.7055838,71.9217877 C18.4995275,71.9217877 22.3857868,69.4606044 22.3857868,66.424581 C22.3857868,63.3885576 18.4995275,60.9273743 13.7055838,60.9273743 C8.91163999,60.9273743 5.02538071,63.3885576 5.02538071,66.424581 C5.02538071,69.4606044 8.91163999,71.9217877 13.7055838,71.9217877 Z"></path></svg>`
  ]

  var shapes = function () {
    const _self = this;

    let ShapeList = defaultShapes;
    if (Array.isArray(this.shapes) && this.shapes.length) ShapeList = this.shapes;
    $(`${this.containerSelector} .main-panel`).append(`<div class="toolpanel" id="shapes-panel"><div class="content"><p class="title">Shapes</p></div></div>`);

    ShapeList.forEach(svg => {
      $(`${this.containerSelector} .toolpanel#shapes-panel .content`).append(`<div class="button">${svg}</div>`)
    })

    $(`${this.containerSelector} .toolpanel#shapes-panel .content .button`).click(function () {
      let svg = $(this).html();

      try {
        fabric.loadSVGFromString(
          svg,
          (objects, options) => {
            var obj = fabric.util.groupSVGElements(objects, options)
            obj.strokeUniform = true
            obj.strokeLineJoin = 'miter'
            obj.scaleToWidth(100)
            obj.scaleToHeight(100)
            obj.set({
              left: 0,
              top: 0
            })
            _self.canvas.add(obj).renderAll()
            _self.canvas.trigger('object:modified')
          }
        )
      } catch (_) {
        console.error("can't add shape");
      }
    })
  }

  window.ImageEditor.prototype.initializeShapes = shapes;
})();