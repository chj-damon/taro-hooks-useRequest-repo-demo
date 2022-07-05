import { useMemo, useRef, useState } from 'react';

import { Empty, PullRefresh } from '@taroify/core';
import { ScrollView, Text, View } from '@tarojs/components';
import { usePageScroll } from '@tarojs/taro';
import { useRequest } from 'taro-hooks';

import dataSource from './data';

export interface PullRefreshListProps<T> {
  service: (...args: any[]) => Promise<Page<T>>;
  renderItem: (item: T) => React.ReactNode;
  cacheKey?: string;
}

const asyncFn = ({ pageSize, offset }: any) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve({
        total: dataSource.length,
        list: dataSource.slice(offset, offset + pageSize),
      });
    }, 1000);
  });

export default function PullRefreshList() {
  const containerRef = useRef();
  const [reachTop, setReachTop] = useState(true);

  usePageScroll(({ scrollTop: aScrollTop }) => {
    setReachTop(aScrollTop === 0);
  });

  const { data, loading, loadingMore, reload, loadMore, noMore } = useRequest(
    (d: any) =>
      asyncFn({
        offset: d?.list?.length || 0,
        pageSize: 5,
      }),
    {
      loadMore: true,
      ref: containerRef,
      isNoMore: (d: any) => (d ? d.list.length >= d.total : false),
    }
  );

  const content = useMemo(() => {
    if (loading) return <View />;
    if (!data) {
      return (
        <View>
          <Text>load failed</Text>
        </View>
      );
    } else if (data.total === 0 || data.list.length === 0) {
      return (
        <View style={{ minHeight: 500 }}>
          <Empty>
            <Empty.Image />
            <Empty.Description>no data</Empty.Description>
          </Empty>
        </View>
      );
    }
    return (
      <ScrollView ref={containerRef} style={{ height: '250px' }} scrollY scrollWithAnimation>
        {data?.list?.map(({ id, name }) => (
          <View style={{ background: 'red', height: 60 }} key={id}>
            {name}
          </View>
        ))}
        {!noMore && <View>{loadingMore ? 'Loading more...' : 'Click to load more'}</View>}
        {noMore && <View>No more data</View>}
        <View style={{ textAlign: 'center', fontSize: 15 }}>total: {data?.total}</View>
      </ScrollView>
    );
  }, [data, loading, loadingMore, noMore]);

  return (
    <PullRefresh loading={loading} reachTop={reachTop} onRefresh={reload}>
      {content}
    </PullRefresh>
  );
}
