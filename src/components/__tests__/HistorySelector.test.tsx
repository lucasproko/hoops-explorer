import React from 'react';
import HistorySelector from '../HistorySelector';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { HistoryManager } from '../../utils/HistoryManager';

describe("HistorySelector", () => {
  test("HistorySelector - should create snapshot", () => {
    // (add some history)
    HistoryManager.addParamsToHistory("year=2019/20&gender=Men", "game-");
    HistoryManager.addParamsToHistory("year=2018/9&gender=Women", "lineup-");
    HistoryManager.addParamsToHistory("year=2018/9&gender=Women", "report-");
    const wrapper = shallow(<HistorySelector
        tablePrefix="game-"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
