import { Tabs } from '@taroify/core';

import TaskList from './components/TaskList';

const Task = () => {
  return (
    <Tabs defaultValue="a">
      <Tabs.TabPane value="a" title="所有">
        <TaskList />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Task;
