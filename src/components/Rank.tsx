import ReactECharts from 'echarts-for-react';
import {
    type Basedata

} from '../Analysis/types';

interface RankProps {
    data: Basedata[];
    totalNum?: number;
}
export default function RankItem({ data, totalNum }: RankProps) {
    const dateFormatter = (item: Basedata) => {
        return `${item.year}/${item.month.toString().padStart(2, '0')}/${item.day.toString().padStart(2, '0')}`;
    };

    const processedData = [...data]
        .sort((a, b) => b.altitude - a.altitude)
        .filter((item, index, arr) =>
            arr.findIndex(i => dateFormatter(i) === dateFormatter(item)) === index
        )
        .map((item, index) => ({
            rank: index + 1,
            date: dateFormatter(item),
            altitude: item.altitude.toFixed(3),
            origin: item
        }));
    console.log(processedData);
    processedData.length = totalNum || Math.min(24, processedData.length);

    const option = {
        title: {
            text: '海拔高度排名',
            // subtext: '数据更新于：' + new Date().toLocaleDateString(),
            left: 'center',
            textStyle: {
                fontSize: 20,
                color: '#333',
                fontFamily: 'Microsoft YaHei'
            },
            subtextStyle: {
                color: '#666'
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const data = params[0].data;
                return `
            <div style="padding: 5px 10px;">
              <div>日期：${data.date}</div>
              <div>排名：${data.rank}</div>
              <div>海拔：${data.altitude}米</div>
              <div>位置：${data.origin.latitude.toFixed(4)}°, ${data.origin.longitude.toFixed(4)}°</div>
            </div>
          `;
            }
        },
        dataset: {
            source: processedData
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: '海拔高度（米）',
            nameLocation: 'middle',
            nameGap: 25,
            axisLine: {
                lineStyle: {
                    color: '#666'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#eee'
                }
            }
        },
        yAxis: {
            type: 'category',
            inverse: true,
            axisLabel: {
                formatter: (params: string) => {
                    const item = processedData.find(d => d.date === params);
                    return `{rank|No.${item?.rank}}  {date|${params}}`;
                },
                rich: {
                    rank: {
                        color: '#fff',
                        backgroundColor: '#1890ff',
                        padding: [3, 5],
                        borderRadius: 4,
                        marginRight: 10
                    },
                    date: {
                        color: '#333',
                        fontWeight: 'bold'
                    }
                }
            },
            axisTick: {
                show: false
            }
        },
        series: [{
            type: 'bar',
            encode: { x: 'altitude', y: 'date' },
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0,
                        color: '#83bff6'
                    }, {
                        offset: 0.5,
                        color: '#188df0'
                    }, {
                        offset: 1,
                        color: '#08519c'
                    }]
                },
                borderRadius: [0, 8, 8, 0]
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                show: true,
                position: 'right',
                formatter: '{@altitude}米',
                color: '#08519c',
                fontWeight: 'bold'
            }
        }],
        dataZoom: [{
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'none',
            labelFormatter: (value: string) => {
                const item = processedData.find(d => d.date === value);
                return item ? `No.${item.rank} ${value}` : '';
            }
        }],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
    };

    return <ReactECharts
        option={option}
        style={{
            height: 600,
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            padding: '20px'
        }}
    />;
}
