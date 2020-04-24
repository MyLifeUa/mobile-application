import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Circle, G, Rect, Text } from 'react-native-svg';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import theme from '../constants/theme.style.js';

const screenWidth = Dimensions.get('window').width;

const Tooltip = ({ x, y, textX, textY, stroke, pointStroke, position }) => {
    let tipW = 50,
        tipH = 36,
        tipX = 5,
        tipY = -9,
        tipTxtX = 12,
        tipTxtY = 6;
    const posY = y;
    const posX = x;

    if (posX > screenWidth - tipW) {
        tipX = -(tipX + tipW);
        tipTxtX = tipTxtX - tipW - 6;
    }

    const boxPosX = position === 'left' ? posX -tipW - 2 : posX;

    return (
        <G>
            <Circle
                cx={posX}
                cy={posY}
                r={4}
                stroke={pointStroke}
                strokeWidth={2}
                fill={'blue'}
            />
            <G x={boxPosX < 40 ? 40 : boxPosX} y={posY}>
                <Rect
                    x={tipX + 1}
                    y={tipY+1}
                    width={tipW - 2}
                    height={tipH - 2}
                    fill={'rgba(255, 255, 255, 0.9)'}
                    rx={2}
                    ry={2}
                />
                <Rect
                    x={tipX}
                    y={tipY}
                    width={tipW}
                    height={tipH}
                    rx={2}
                    ry={2}
                    fill={'transparent'}
                    stroke={theme.primary_color}
                />
                <Text x={tipTxtX} y={tipTxtY} fontSize="10" textAnchor="start">
                    {textX}
                </Text>

                <Text
                    x={tipTxtX}
                    y={tipTxtY + 14}
                    fontSize="12"
                    textAnchor="start">
                    {textY}
                </Text>
            </G>
        </G>
    );
};

Tooltip.propTypes = {
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
    height: PropTypes.number,
    stroke: PropTypes.string,
    pointStroke: PropTypes.string,
    textX: PropTypes.string,
    textY: PropTypes.string,
    position: PropTypes.string,
};

Tooltip.defaultProps = {
    position: 'rigth',
};

const tooltipDecorators = (state, data, valueFormatter) => () => {
    if (state === null) {
        return null;
    }

    const { index, value, x, y } = state;
    const textX = data.labels[index];
    //console.log(data.labels.length <= index + 8 ? 'left' : 'right');
    

    const position = data.labels.length <= index + 8 ? 'left' : 'right';

    return (
        <Tooltip
            textX={String(textX)}
            textY={valueFormatter(value)}
            x={x}
            y={y}
            stroke={'#00ccff'}
            pointStroke={'#00ccff'}
            position={position}
        />
    );
};

const LineChartWithTooltips = ({ valueFormatter, ...props }) => {
    const [state, setState] = useState(null);
    return (
        <LineChart
            {...props}
            decorator={tooltipDecorators(state, props.data, valueFormatter)}
            onDataPointClick={setState}
        />
    );
};

LineChartWithTooltips.propTypes = {
    valueFormatter: PropTypes.func,
};

LineChartWithTooltips.defaultProps = {
    valueFormatter: value => String(value),
};

export default LineChartWithTooltips;