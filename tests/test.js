QUnit.test('Select Month-To-Date date range', function (assert) {
  expect(2);

  $('#drp-select-daterange').val('MONTH_TO_DATE').change();
  var $startDate = $('#drp-input-startdate');
  var $endDate = $('#drp-input-enddate');

  assert.ok($startDate.val() === 'Mar 1, 2014', 'startDate equals the start of the month');
  assert.ok($endDate.val() === 'Mar 29, 2014', 'endDate equals yesterdays date');

});


QUnit.test('Select Year-To-Date date range', function (assert) {
  expect(2);

  $('#drp-select-daterange').val('YEAR_TO_DATE').change();
  var $startDate = $('#drp-input-startdate');
  var $endDate = $('#drp-input-enddate');

  assert.ok($startDate.val() === 'Jan 1, 2014', 'startDate equals the start of the year');
  assert.ok($endDate.val() === 'Mar 29, 2014', 'endDate equals yesterdays date');

});


QUnit.test('Select Last Week date range', function (assert) {
  expect(2);

  $('#drp-select-daterange').val('LAST_WEEK').change();
  var $startDate = $('#drp-input-startdate');
  var $endDate = $('#drp-input-enddate');

  assert.ok($startDate.val() === 'Mar 23, 2014', 'startDate equals the beginning of last week');
  assert.ok($endDate.val() === 'Mar 29, 2014', 'endDate equals the end of last week');

});


QUnit.test('Select Last Month date range', function (assert) {
  expect(2);

  $('#drp-select-daterange').val('LAST_MONTH').change();
  var $startDate = $('#drp-input-startdate');
  var $endDate = $('#drp-input-enddate');
  console.log($endDate.val());
  assert.ok($startDate.val() === 'Feb 1, 2014', 'startDate equals the beginning of last month');
  assert.ok($endDate.val() === 'Feb 28, 2014', 'endDate equals the end of last month');

});


QUnit.test('Select Last 7 Days date range', function (assert) {
  expect(2);

  $('#drp-select-daterange').val('LAST_7_DAYS').change();
  var $startDate = $('#drp-input-startdate');
  var $endDate = $('#drp-input-enddate');

  assert.ok($startDate.val() === 'Mar 23, 2014', 'startDate equals 7 days ago' );
  assert.ok($endDate.val() === 'Mar 29, 2014', 'endDate equals yesterdays date');

});


QUnit.test('Select Last 30 Days date range', function (assert) {
  expect(2);

  $('#drp-select-daterange').val('LAST_30_DAYS').change();
  var $startDate = $('#drp-input-startdate');
  var $endDate = $('#drp-input-enddate');

  assert.ok($startDate.val() === 'Feb 28, 2014', 'startDate equals 30 days ago' );
  assert.ok($endDate.val() === 'Mar 29, 2014', 'endDate equals yesterdays date');

});
