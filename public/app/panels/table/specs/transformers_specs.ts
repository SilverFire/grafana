import {describe, beforeEach, it, sinon, expect} from 'test/lib/common';

import {TableModel} from '../table_model';

describe('when transforming time series table', () => {
  var table;

  describe('given 2 time series', () => {
    var time = new Date().getTime();
    var timeSeries = [
      {
        target: 'series1',
        datapoints: [[12.12, time], [14.44, time+1]],
      },
      {
        target: 'series2',
        datapoints: [[16.12, time]],
      }
    ];

    describe('timeseries_to_rows', () => {
      var panel = {
        transform: 'timeseries_to_rows',
        sort: {col: 0, desc: true},
      };

      beforeEach(() => {
        table = TableModel.transform(timeSeries, panel);
      });

      it('should return 3 rows', () => {
        expect(table.rows.length).to.be(3);
        expect(table.rows[0][1]).to.be('series1');
        expect(table.rows[1][1]).to.be('series1');
        expect(table.rows[2][1]).to.be('series2');
        expect(table.rows[0][2]).to.be(12.12);
      });

      it('should return 3 rows', () => {
        expect(table.columns.length).to.be(3);
        expect(table.columns[0].text).to.be('Time');
        expect(table.columns[1].text).to.be('Series');
        expect(table.columns[2].text).to.be('Value');
      });
    });

    describe('timeseries_to_columns', () => {
      var panel = {
        transform: 'timeseries_to_columns'
      };

      beforeEach(() => {
        table = TableModel.transform(timeSeries, panel);
      });

      it ('should return 3 columns', () => {
        expect(table.columns.length).to.be(3);
        expect(table.columns[0].text).to.be('Time');
        expect(table.columns[1].text).to.be('series1');
        expect(table.columns[2].text).to.be('series2');
      });

      it ('should return 2 rows', () => {
        expect(table.rows.length).to.be(2);
        expect(table.rows[0][1]).to.be(12.12);
        expect(table.rows[0][2]).to.be(16.12);
      });

      it ('should be undefined when no value for timestamp', () => {
        expect(table.rows[1][2]).to.be(undefined);
      });
    });

    describe('timeseries_to_summaries', () => {
      var panel = {
        transform: 'timeseries_to_summaries',
        sort: {col: 0, desc: true},
      };

      beforeEach(() => {
        table = TableModel.transform(timeSeries, panel);
      });

      // it('should return 2 rows', () => {
      //   expect(table.rows.length).to.be(2);
      //   expect(table.rows[0][0]).to.be('series1');
      //   expect(table.rows[0][1]).to.be('Min');
      //   expect(table.rows[1][0]).to.be('series2');
      // });
      //
      // it('should return 2 columns', () => {
      //   expect(table.columns.length).to.be(3);
      //   expect(table.columns[0].text).to.be('Series');
      //   expect(table.columns[1].text).to.be('Min');
      //   expect(table.columns[2].text).to.be('Value');
      // });
    });


    describe('JSON Data', () => {
      var panel = {
        transform: 'json',
        columns: [{name: 'timestamp'}, {name: 'message'}]
      };
      var rawData = [
        {
          type: 'docs',
          datapoints: [
            {
              timestamp: 'time',
              message: 'message'
            }
          ]
        }
      ];

      beforeEach(() => {
        table = TableModel.transform(rawData, panel);
      });

      it ('should return 2 columns', () => {
        expect(table.columns.length).to.be(2);
        expect(table.columns[0].text).to.be('timestamp');
        expect(table.columns[1].text).to.be('message');
      });

      it ('should return 2 rows', () => {
        expect(table.rows.length).to.be(1);
        expect(table.rows[0][0]).to.be('time');
        expect(table.rows[0][1]).to.be('message');
      });
    });

    describe('Annnotations', () => {
      var panel = {transform: 'annotations'};
      var rawData = [
        {
          min: 1000,
          text: 'hej',
          tags: ['tags', 'asd'],
          title: 'title',
        }
      ];

      beforeEach(() => {
        table = TableModel.transform(rawData, panel);
      });

      it ('should return 4 columns', () => {
        expect(table.columns.length).to.be(4);
        expect(table.columns[0].text).to.be('Time');
        expect(table.columns[1].text).to.be('Title');
        expect(table.columns[2].text).to.be('Text');
        expect(table.columns[3].text).to.be('Tags');
      });

      it ('should return 1 rows', () => {
        expect(table.rows.length).to.be(1);
        expect(table.rows[0][0]).to.be(1000);
      });
    });

  });
});

