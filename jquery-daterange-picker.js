;(function ($, window, document, undefined) {

  // create the defaults once
  var pluginName = 'dateRangePicker';

  var defaults = {
    container: null,
    numberOfMonths: 3,
    datepickerShowing: true,
    defaultDate: '-1D',
    defaultDateRange: 'LAST_7_DAYS',
    maxDate: '-1D',
    minDate: new Date(2011, 0, 1),
    test: false,
    today: null
  };

  // the actual plugin constructor
  function DateRangePicker (element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }


  // avoid Plugin.prototype conflicts
  $.extend(DateRangePicker.prototype, {

    init: function () {
      this.setupContainer();
      this.initializeDateRange();
      this.initializeDatePicker();
    },

    setupContainer: function () {

      var dates = '<span id="date-fields">Dates:' +
        '<input type="text" id="drp-input-startdate" size="10" readonly> -' +
        ' <input type="text" id="drp-input-enddate" size="10" readonly></span>';

      var select = '<select id="drp-select-daterange">' +
        '<option value="CUSTOM" selected>Custom</option>' +
        '<option value="MONTH_TO_DATE">Month To Date</option>' +
        '<option value="YEAR_TO_DATE">Year To Date</option>' +
        '<option value="LAST_WEEK">Last Week</option>' +
        '<option value="LAST_MONTH">Last Month</option>' +
        '<option value="LAST_7_DAYS">Last 7 Days</option>' +
        '<option value="LAST_30_DAYS">Last 30 Days</option>' +
        '</select>';

      var controls = '<span><a href="" id="drp-btn-cancel">cancel</a></span>' +
        '<span><button id="drp-btn-apply">Apply</button></span>';

      var datepickerContainer = '<div id="drp-container-datepicker"></div>';

      var $container = $(this.settings.container);
      $container.html(dates + select + controls + datepickerContainer);

      this._$startDate = $('#drp-input-startdate');
      this._$endDate = $('#drp-input-enddate');
      this._$selectedDateRange = $('#drp-select-daterange');
      this._$cancel = $('#drp-btn-cancel');
      this._$apply = $('#drp-btn-apply');
      this._$datepicker = $('#drp-container-datepicker');
      this._$element = $('#'+ this.element.id + '');
      this._$container = $(this.settings.container);

    },

    getDateRange: function (option) {

      var settings = this.settings;

      var dateRange = {
        start: '',
        end: ''
      };

      var today = function () {
        return settings.test ? moment(settings.today) : moment();
      };

      var daysToSubtract;
      var dayOfTheWeek;


      switch (option) {

        case 'MONTH_TO_DATE':
          var dayOfTheMonth = today().date() - 1;
          dateRange.start = today().subtract(dayOfTheMonth, 'days').format('ll');
          dateRange.end = today().subtract(1, 'days').format('ll');
          break;

        case 'YEAR_TO_DATE':
          var dayOfTheYear = today().dayOfYear() - 1;
          dateRange.start = today().subtract(dayOfTheYear, 'days').format('ll');
          dateRange.end = today().subtract(1, 'days').format('ll');
          break;

        case 'LAST_WEEK':
          var lastWeek = today().subtract(1, 'weeks');
          daysToSubtract = lastWeek.day();
          dayOfTheWeek = today().day() + 1;
          dateRange.start = moment(lastWeek).subtract(daysToSubtract, 'days').format('ll');
          dateRange.end = today().subtract(dayOfTheWeek, 'days').format('ll');
          break;

        case 'LAST_MONTH':
          var lastMonth = today().subtract(1, 'months');
          daysToSubtract = lastMonth.date() - 1;
          dayOfTheMonth = today().date();
          dateRange.start = moment(lastMonth).subtract(daysToSubtract, 'days').format('ll');
          dateRange.end = today().subtract(dayOfTheMonth, 'days').format('ll');
          break;

        case 'LAST_7_DAYS':
          dateRange.start = today().subtract(7, 'days').format('ll');
          dateRange.end = today().subtract(1, 'days').format('ll');
          break;

        case 'LAST_30_DAYS':
          dateRange.start = today().subtract(30, 'days').format('ll');
          dateRange.end = today().subtract(1, 'days').format('ll');
          break;

        case 'CUSTOM':
          dateRange.start = this._$startDate.val();
          dateRange.end = this._$endDate.val();
          break;

        default:
          dateRange.start = today().subtract(30, 'days').format('ll');
          dateRange.end = today().subtract(1, 'days').format('ll');

      }

      return dateRange;

    },

    initializeDateRange: function () {

      var dateRange = this.getDateRange(this.settings.defaultDateRange);

      this._$element.val(dateRange.start + ' - ' + dateRange.end);
      this._$startDate.val(dateRange.start);
      this._$endDate.val(dateRange.end);

    },

    initializeDatePicker: function () {

      var self = this;

      $('#drp-container-datepicker').datepicker({
        numberOfMonths: 3,
        datepickerShowing: true,
        dateFormat: 'M dd, yy', // ex. Aug 30, 2014
        defaultDate: '-1D',
        maxDate: '-1D',
        minDate: this.settings.minDate,


        beforeShowDay: function (date) {

          var start = self._$startDate.val();
          var end = self._$endDate.val();

          var startDate = $.datepicker.parseDate('M dd, yy', self._$startDate.val());
          var endDate = $.datepicker.parseDate('M dd, yy', self._$endDate.val());

          var startDateFocus = self._$startDate.is(':focus');

          // startDate is not set
          if (!startDate) {
            return [true, ''];
          }
          // date is startDate
          else if (date.getTime() === startDate.getTime()) {
            return [true, 'date-range-item'];
          }
          // date is before startDate
          else if (!startDateFocus && date < startDate) {
            return [false, ''];
          }
          // date is within the date range
          else if (endDate && date >= startDate && date <= endDate) {
            return [true, 'date-range-item'];
          }
          else {
            return [true, ''];
          }

        },


        onSelect: function(dateText, inst) {

          var date1 = $.datepicker.parseDate('M dd, yy', self._$startDate.val());
          var date2 = $.datepicker.parseDate('M dd, yy', self._$endDate.val());

          self._$selectedDateRange.val('CUSTOM');
          self._$startDate.focus();

          if (!date1 || date2) {

            self._$startDate.val(dateText);
            self._$endDate.val('');
            self._$endDate.focus();

          }
          else {
            self._$endDate.val(dateText);
          }

        }


      });


      // disable input when a predefined date range is selected
      self._$selectedDateRange.on('change', function () {

        var $this = $(this);
        var selectedDateRangeValue = $this.val();
        var dateRange;

        var setDateRange = function (start, end) {

          self._$startDate.val(start);
          self._$endDate.val(end);

          $('#drp-container-datepicker').datepicker('refresh');

        };

        if (selectedDateRangeValue === 'CUSTOM') {

          self._$startDate.focus();
          $('#drp-container-datepicker').datepicker('refresh');

        }
        else {
          dateRange = self.getDateRange(selectedDateRangeValue);
          setDateRange(dateRange.start, dateRange.end);
        }

      });


      self._$cancel.on('click', function (e) {
        e.preventDefault();
        self._$startDate.val('');
        self._$endDate.val('');

        self._$startDate.focus();
        self._$selectedDateRange.val('CUSTOM');
        $('#drp-container-datepicker').datepicker('refresh');

      });


      self._$apply.on('click', function () {

        // disable button if date range input fields are empty
        if (self._$startDate.val() === '' || self._$endDate.val() === '') {
          self._$startDate.focus();
          return;
        }
        else {

          self.settings.defaultDateRange =  self._$selectedDateRange.val();

          self.initializeDateRange();

          self._$container.toggle();
          $(this).blur();
          self._$startDate.focus();
          $('#drp-container-datepicker').datepicker('refresh');
        }

      });


      this._$element.on('click', function () {

        self._$container.toggle();
        $(this).blur();
        self._$startDate.focus();
        $('#drp-container-datepicker').datepicker('refresh');

      });


      // close date picker if clicked elsewhere
      $(document).click(function (event) {
        var $target = $(event.target);
        if (!($target.attr('id') === self._$element.attr('id') ||
          $target.closest('#daterange-picker-container, .ui-datepicker-header').length)) {
          self._$container.hide();
        }
      });

    }

  });


  // a really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[ pluginName ] = function ( options ) {
    this.each(function() {
      if ( !$.data( this, 'plugin_' + pluginName ) ) {
        $.data( this, 'plugin_' + pluginName, new DateRangePicker( this, options ) );
      }
    });

    // chain jQuery functions
    return this;
  };


})(jQuery, window, document);
