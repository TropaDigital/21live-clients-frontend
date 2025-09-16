/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import * as S from './styles';
import 'react-day-picker/dist/style.css';
import moment from 'moment';
import { IconCalendarDay } from '../../../../assets/icons';
import { SelectDefault } from '../select-default';

export const InputDateRange = ({
  label,
  dates,
  setDates
}: {
  label: string;
  dates: DateRange | undefined;
  setDates(dates: DateRange | undefined): void;
}) => {
  const refInput = useRef<any>(null);
  const [range, setRange] = useState<DateRange | undefined>(dates);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    console.log('dates', dates);
  }, [dates]);

  useEffect(() => {
    if (range?.to && range.from) {
      setDates({
        to: new Date(moment(range.to).format('YYYY-MM-DD 00:00')),
        from: new Date(moment(range.from).format('YYYY-MM-DD 00:00'))
      });
    }
  }, [range]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (refInput.current && !refInput.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <S.Container ref={refInput}>
      <span className="label">{label}</span>

      <div className="input" onClick={() => setShowCalendar(!showCalendar)}>
        <i>
          <IconCalendarDay />
        </i>
        <span className="date-text">
          {range?.from && range?.to
            ? `${range.from.toLocaleDateString()} até ${range.to.toLocaleDateString()}`
            : 'Nenhum intervalo de datas.'}
        </span>
      </div>

      {showCalendar && (
        <div className="absolute-calendar">
          <InputDateRangeSolid range={range} setRange={setRange} />
        </div>
      )}
    </S.Container>
  );
};

export interface ITypesDateRange {
  name: string;
  value: string;
}

export const InputDateRangeByType = ({
  renderOnlyDate,
  typeSelected,
  onChangeTypeSelected,
  types,
  dates,
  setDates
}: {
  renderOnlyDate?: boolean;
  typeSelected: ITypesDateRange;
  onChangeTypeSelected(type: ITypesDateRange): void;
  types: ITypesDateRange[];
  dates: DateRange | undefined;
  setDates(dates: DateRange | undefined): void;
}) => {
  const [type, setType] = useState<ITypesDateRange>(typeSelected);

  const handleChangeType = (value: string) => {
    if (value) {
      setType(types?.filter((obj) => obj.value === value)[0]);
    } else {
      setType({
        name: '',
        value: ''
      });
    }
  };

  useEffect(() => {
    onChangeTypeSelected(type);
  }, [type]);

  useEffect(() => {
    console.log('here');
    setType(typeSelected);
  }, [typeSelected]);

  return (
    <S.ContainerByTypes>
      <SelectDefault
        label="Tipo de data"
        value={type}
        onChange={(e) => handleChangeType(e.value)}
        options={types}
      />

      {renderOnlyDate === true && dates?.to && dates.from && (
        <InputDateRange dates={dates} setDates={setDates} label={type.name} />
      )}

      {!renderOnlyDate && <InputDateRange dates={dates} setDates={setDates} label={type.name} />}
    </S.ContainerByTypes>
  );
};

export const InputDateRangeSolid = ({
  range,
  setRange
}: {
  range: DateRange | undefined;
  setRange(date: DateRange | undefined): void;
}) => {
  return (
    <S.ContainerSolid>
      <DayPicker mode="range" selected={range} onSelect={setRange} locale={ptBR} />
    </S.ContainerSolid>
  );
};
