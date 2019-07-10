import * as React from 'react';
import Calendar from '@/components/Calendar';
import { dateFormate, combine } from '@/utils/utils';

const { useState, useEffect } = React;

interface Props {
  text: string
};

function ProdDetail(props: Props) {
  const { text } = props;
  const show = combine();
  const [time, setTime] = useState(dateFormate({
    timeStamp: Date.now(),
    splitChar: '/'
  }));

  const int = setInterval(() => {
    setTime(dateFormate({
      timeStamp: Date.now(),
      splitChar: '/'
    }));
  }, 1000)

  useEffect(() => {
    return () => {
      clearInterval(int);
    }
  })

  const calendarParams = {year: new Date().getFullYear(), month: new Date().getMonth() + 1};

  return (
    <section>
      { text }
      <div>
        时间：{ time }
      </div>
      { show }

      <Calendar year={calendarParams.year} month={calendarParams.month} />
    </section>
  )
};

export default ProdDetail;
