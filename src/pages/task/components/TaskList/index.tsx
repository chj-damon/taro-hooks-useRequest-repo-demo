import { useCallback } from 'react';

import { Flex, WhiteSpace } from '@taroify/core';
import { Text, View } from '@tarojs/components';

import dataSource from './data';
import styles from './index.module.less';

import PullRefreshList from '@/components/PullRefreshList';

function fetchData({
  type,
  page = 1,
  pageSize = 10,
}: {
  type: string;
  page?: number;
  pageSize?: number;
}): Promise<Page<Task>> {
  const offset = page ? (page - 1) * pageSize : 0;
  // console.log(page, offset, type);

  let list: Task[] = dataSource;
  let filteredList: Task[] = [];
  switch (type) {
    case 'all':
    default:
      filteredList = list.slice(offset, offset + pageSize);
      break;

    case 'processing':
    case 'done':
      list = dataSource.filter(item => item.status === type);
      filteredList = list.slice(offset, offset + pageSize);
      break;
  }
  return new Promise(resolve => {
    const data = {
      total: list.length,
      page,
      pageSize,
      list: filteredList,
    };
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });
}

interface Task {
  id: number;
  base: string;
  name: string;
  status: string;
  endTime: string;
}

export default function TaskList({ type = 'all' }: { type: 'all' | 'processing' | 'done' }) {
  const renderItem = useCallback(
    (item: Task) => {
      return (
        <View key={item.id} className={styles.item}>
          <Text className={styles.name}>{item.name}</Text>
          <WhiteSpace size={4} />
          <Flex justify="center" align="center">
            <Text className={styles.time}>截止时间：{item.endTime}</Text>
          </Flex>
        </View>
      );
    },
    []
  );

  const loadData = (d: any) => {
    console.log(d, '444');
    if (d) {
      return fetchData({ type, page: d.page + 1, pageSize: d.pageSize });
    }
    return fetchData({ type });
  };

  return <PullRefreshList service={loadData} renderItem={renderItem} />;
}
