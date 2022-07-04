import { useRef, useState } from 'react';

import { List, Loading, PullRefresh } from '@taroify/core';
import { usePageScroll } from '@tarojs/taro';
import { useRequest } from 'taro-hooks';

export interface PullRefreshListProps<T> {
  service: (...args: any[]) => Promise<Page<T>>;
  renderItem: (item: T) => React.ReactNode;
  cacheKey?: string;
}

export default function PullRefreshList<T>({ service, renderItem, cacheKey }: PullRefreshListProps<T>) {
  const containerRef = useRef();

  const [scrollTop, setScrollTop] = useState(0);
  const [reachTop, setReachTop] = useState(true);

  usePageScroll(({ scrollTop: aScrollTop }) => {
    setScrollTop(aScrollTop);
    setReachTop(aScrollTop === 0);
  });

  const { data, loading, reload, loadMore, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    cacheKey,
    ref: containerRef,
    isNoMore: (d: any) => {
      if (d) {
        return d.list.length >= d.total;
      }
      return false;
    },
  });

  const { list = [] } = data || {};
  // console.log(list, loading, noMore, loadingMore);
  console.log(data, '555');

  return (
    <PullRefresh loading={loading} reachTop={reachTop} onRefresh={reload}>
      <List ref={containerRef} loading={loading} hasMore={!noMore} scrollTop={scrollTop} onLoad={loadMore}>
        {list.map(renderItem)}
        <List.Placeholder>
          {loading && <Loading>加载中...</Loading>}
          {!noMore && '没有更多了'}
        </List.Placeholder>
      </List>
    </PullRefresh>
  );
}
