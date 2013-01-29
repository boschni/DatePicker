/**
 * Creates an instance of DatePicker.
 *
 * @constructor
 * @alias module:DatePicker
 */
var DatePicker = function (element) {

	this.element = $(element);

	// Define state properties
	this.visible = false;
	this.viewDate = moment();
	this.selectedDate = null;

	// Define options properties
	this.locale = 'nl';
	this.textFieldFormat = 'DD-MM-YYYY';
	this.startDate = moment([1900, 0, 1]);
	this.endDate = moment([2100, 11, 31]);
	this.disableSaturdays = false;
	this.disableSundays = false;

	// Define element properties
	this.textField = null
	this.dialogButton = null;
	this.monthSelect = null;
	this.monthSelectBox = null;
	this.yearSelect = null;
	this.yearSelectBox = null;
	this.calendar = null;
	this.calendarDays = null;
	this.calendarDayLabels = null;
	this.prevMonthButton = null;
	this.nextMonthButton = null;

	// Initialize minimal
	this.initComponentMinimal();
};

DatePicker.prototype = {

	initComponentMinimal: function () {

		var self = this;

		this.renderDialogButton();

		this.dialogButton.on('click.initFull', function (e) {
			e.preventDefault();
			self.dialogButton.off('click.initFull');
			self.initComponentFull();
			self.showDialog();
		});
	},

	initComponentFull: function () {

		this.getAndSetOptions();
		this.getAndSetElements();
		this.render();
		this.bindEvents();
		this.updateFromTextField();
	},

	getAndSetOptions: function () {

		var element = this.element,
			locale = element.attr('data-locale'),
			textFieldFormat = element.attr('data-textfield-format'),
			startDate = element.attr('data-start-date'),
			endDate = element.attr('data-end-date'),
			disableWeekends = element.attr('data-disable-weekends'),
			disableSaturdays = element.attr('data-disable-saturdays'),
			disableSundays = element.attr('data-disable-sundays');

		if (locale) {
			this.locale = locale;
		}

		if (textFieldFormat) {
			this.textFieldFormat = textFieldFormat;
		}

		if (startDate) {
			this.startDate = moment(startDate, 'DD-MM-YYYY');
		}

		if (endDate) {
			this.endDate = moment(endDate, 'DD-MM-YYYY');
		}

		if (disableWeekends || disableSaturdays) {
			this.disableSaturdays = true;
		}

		if (disableWeekends || disableSundays) {
			this.disableSundays = true;
		}
	},

	getAndSetElements: function () {

		this.textField = $('.datepicker-textfield', this.element).first();
	},

	render: function () {

		this.renderDialogButton();
		this.renderDialog();
		this.renderMonthSelect();
		this.renderMonthSelectOptions();
		this.renderMonthSelectBox();
		this.renderYearSelect();
		this.renderYearSelectOptions();
		this.renderYearSelectBox();
		this.renderCalendar();
		this.renderCalendarDayLabels();
		this.renderCalendarDays();
		this.renderCalendarDaysOptions();
		this.renderNextMonthButton();
		this.renderPrevMonthButton();
	},

	renderDialogButton: function () {

		if ( ! this.dialogButton) {
			this.dialogButton = $('<a class="datepicker-dialog-button" href="#">Kalender</a>');
			this.dialogButton.appendTo(this.element);
		}
	},

	renderDialog: function () {

		if ( ! this.dialog) {
			this.dialog = $('<div class="datepicker-dialog"></div>');
		}
	},

	renderMonthSelect: function () {

		if ( ! this.monthSelect) {
			this.monthSelect = $('<select class="datepicker-month-select">');
			this.monthSelect.appendTo(this.dialog);
		}
	},

	renderMonthSelectOptions: function () {

		var date,
			option,
			startDate = this.startDate.clone().startOf('month'),
			endDate = this.endDate.clone().endOf('month'),
			viewMonth = this.viewDate.month(),
			viewYear = this.viewDate.year(),
			options = document.createDocumentFragment();

		for (var i = 0; i <= 11; i++) {

			date = moment([viewYear, i, 1]);

			option = $('<option value="' + i + '">' + date.format('MMMM') + '</option>');

			if (date < startDate || date.endOf('month') > endDate) {
				option.attr('disabled', 'disabled');
			}

			if (i === viewMonth) {
				option.attr('selected', 'selected');
			}

			options.appendChild(option[0]);
		}

		this.monthSelect.html(options);
	},

	renderMonthSelectBox: function () {

		if ( ! this.monthSelectBox) {
			this.monthSelectBox = $('<div class="datepicker-month-select-box"></div>');
			this.monthSelectBox.appendTo(this.dialog);
		}

		this.monthSelectBox.text(this.viewDate.format('MMMM'));
	},

	renderYearSelect: function () {

		if ( ! this.yearSelect) {
			this.yearSelect = $('<select class="datepicker-year-select">');
			this.yearSelect.appendTo(this.dialog);
		}
	},

	renderYearSelectOptions: function () {

		var option,
			options = document.createDocumentFragment(),
			minYear = this.startDate.year(),
			maxYear = this.endDate.year(),
			viewYear = this.viewDate.year();

		for (var i = minYear; i <= maxYear; i++) {

			option = $('<option value="' + i + '">' + i + '</option>');

			if (i === viewYear) {
				option.attr('selected', 'selected');
			}

			options.appendChild(option[0]);
		}

		this.yearSelect.html(options);
	},

	renderYearSelectBox: function () {

		if ( ! this.yearSelectBox) {
			this.yearSelectBox = $('<div class="datepicker-year-select-box"></div>');
			this.yearSelectBox.appendTo(this.dialog);
		}

		this.yearSelectBox.text(this.viewDate.year());
	},

	renderCalendar: function () {

		if ( ! this.calendar) {
			this.calendar = $('<div class="datepicker-calendar"></div>');
			this.calendar.appendTo(this.dialog);
		}
	},

	renderCalendarDayLabels: function () {

		if ( ! this.calendarDayLabels) {
			this.calendarDayLabels = $('<ol class="datepicker-calendar-day-labels"></ol>');
			this.calendarDayLabels.appendTo(this.calendar);
		}

		var labels = document.createDocumentFragment(),
			date = moment([this.viewDate.year(), this.viewDate.month(), 1]);

		for (var i = 0; i < 7; i++) {
			labels.appendChild($('<li>' + date.date(i).format('dd') + '</li>')[0]);
		}

		this.calendarDayLabels.html(labels);
	},

	renderCalendarDays: function () {

		if ( ! this.calendarDays) {
			this.calendarDays = $('<ol class="datepicker-calendar-days"></ol>');
			this.calendarDays.appendTo(this.calendar);
		}
	},

	renderCalendarDaysOptions: function () {

		var option,
			options = document.createDocumentFragment(),
			date = moment([this.viewDate.year(), this.viewDate.month(), 1]),
			daysInMonth = this.viewDate.daysInMonth();

		for (var i = 1; i <= daysInMonth; i++) {

			date.date(i);

			option = $('<li>' + i + '</li>');

			if (this.isDateSelected(date)) {
				option.addClass('is-selected');
			}

			if ( ! this.isDateSelectable(date)) {
				option.addClass('is-disabled');
			}

			options.appendChild(option[0]);
		}

		this.calendarDays.html(options);
	},

	isDateSelected: function (date) {

		return (this.selectedDate && date.valueOf() === this.selectedDate.valueOf());
	},

	isDateSelectable: function (date) {

		if ((date < this.startDate) ||
		    (date > this.endDate) ||
		    (this.disableSaturdays && date.day() === 6) ||
		    (this.disableSundays && date.day() === 0)) {
			return false;
		}

		return true;
	},

	renderPrevMonthButton: function () {

		if ( ! this.prevMonthButton) {
			this.prevMonthButton = $('<a class="datepicker-prev-month-button" href="#">Vorige maand</a>')
			this.prevMonthButton.appendTo(this.dialog);
		}
	},

	renderNextMonthButton: function () {

		if ( ! this.nextMonthButton) {
			this.nextMonthButton = $('<a class="datepicker-next-month-button" href="#">Volgende maand</a>')
			this.nextMonthButton.appendTo(this.dialog);
		}
	},

	bindEvents: function () {

		$('body')
			.on('click', $.proxy(this.onClickBody, this));

		this.dialogButton
			.on('click', $.proxy(this.onClickDialogButton, this));

		this.prevMonthButton
			.on('click', $.proxy(this.onClickPrevMonthButton, this));

		this.nextMonthButton
			.on('click', $.proxy(this.onClickNextMonthButton, this));

		this.monthSelect
			.on('change', $.proxy(this.onChangeMonthSelect, this));

		this.yearSelect
			.on('change', $.proxy(this.onChangeYearSelect, this));

		this.calendarDays
			.on('click', 'li', $.proxy(this.onClickCalendarDay, this));

		this.textField
			.on('change', $.proxy(this.onChangeTextField, this));
	},

	onClickDialogButton: function (e) {

		e.preventDefault();

		if (this.visible) {
			this.hideDialog();
		} else {
			this.showDialog();
		}
	},

	onClickBody: function (e) {

		if (this.visible) {
			var target = $(e.target);

			if (target[0] !== this.dialog[0] &&
				target[0] !== this.dialogButton[0] &&
				target.closest('.datepicker-dialog')[0] !== this.dialog[0]) {
				this.hideDialog();
			}
		}
	},

	onChangeMonthSelect: function (e) {

		this.viewDate.month(this.monthSelect.val());
		this.render();
	},

	onChangeYearSelect: function (e) {

		this.viewDate.year(this.yearSelect.val());
		this.render();
	},

	onClickPrevMonthButton: function (e) {

		e.preventDefault();
		this.viewDate.subtract('M', 1);
		this.render();
	},

	onClickNextMonthButton: function (e) {

		e.preventDefault();
		this.viewDate.add('M', 1);
		this.render();
	},

	onClickCalendarDay: function (e) {

		var date = moment([this.viewDate.year(), this.viewDate.month(), $(e.target).text()]);

		e.preventDefault();

		if (this.isDateSelectable(date)) {
			this.selectedDate = date;
			this.updateTextField();
			this.hideDialog();
		}
	},

	onChangeTextField: function (e) {

		this.updateFromTextField();
	},

	updateTextField: function () {

		if (this.selectedDate) {
			var ouputValue = this.selectedDate.format(this.textFieldFormat),
				currentValue = this.textField.val();

			if (currentValue !== ouputValue) {
				this.textField.val(ouputValue).change();
			}
		}
	},

	updateFromTextField: function () {

		var value = this.textField.val(),
			date = moment(value, this.textFieldFormat),
			formattedDate = (date) ? date.format(this.textFieldFormat) : null;

		this.selectedDate = (value.toLowerCase() === formattedDate.toLowerCase()) ? date : null;

		if (this.visible) {
			this.render();
		}
	},

	showDialog: function () {

		if ( ! this.visible) {
			this.render();
			this.dialog.appendTo(this.element);
			this.visible = true;
		}
	},

	hideDialog: function () {

		if (this.visible) {
			this.dialog.detach();
			this.visible = false;
		}
	}
};