import {
  check_district_position,
  check_position,
  Month_value2name,
  type AltiCount,
  type Basedata,
  type MonthCount,
  type Position,
  type YearCount,
} from "./types";

interface OptionType {
  value: string;
  label: string;
}

export function CityCennter(pos_arrays: Position[]) {
  const len = pos_arrays.length;
  let long: number = 0;
  let lat: number = 0;
  for (let pos_array of pos_arrays) {
    long += pos_array.longitude;
    lat += pos_array.latitude;
  }

  long /= len;
  lat /= len;

  return {
    lat: lat,
    lng: long,
  };
}

// 拿到某个district的count
export function CountDistrict(bases: Basedata[], pos_array: Position) {
  const district_pos_arrays: Position[] = [];
  for (let base of bases) {
    const base_position: Position = {
      longitude: base.longitude,
      latitude: base.latitude,
      city: "",
      count: 1,
      lastTime: base.day,
    };

    // 首先在这个city
    if (check_position(base_position, pos_array)) {
      let flag = true;
      for (let district_pos_array of district_pos_arrays) {
        if (check_district_position(district_pos_array, base_position)) {
          flag = false;
          if (base_position.lastTime > district_pos_array.lastTime) {
            district_pos_array.count++;
          }

          district_pos_array.lastTime = base_position.lastTime;
          break;
        }
      }
      if (flag) {
        district_pos_arrays.push(base_position);
      }
    }
  }
  return district_pos_arrays;
}

export function CountCity(bases: Basedata[]) {
  const pos_arrays: Position[] = [];
  for (let base of bases) {
    let flag = true;
    const base_position: Position = {
      longitude: base.longitude,
      latitude: base.latitude,
      city: "",
      count: 1,
      lastTime: base.day + base.month * 100 + base.year * 10000,
    };
    for (let pos_array of pos_arrays) {
      let pos_postion: Position = {
        longitude: pos_array.longitude,
        latitude: pos_array.latitude,
        city: "",
        count: pos_array.count,
        lastTime: pos_array.lastTime,
      };

      if (check_position(base_position, pos_postion)) {
        flag = false;
        if (base_position.lastTime > pos_postion.lastTime) pos_array.count++;
        pos_array.lastTime = base_position.lastTime;
        break;
      }
    }

    if (flag) {
      pos_arrays.push(base_position);
    }
  }

  return pos_arrays;
}

export function YearOption(year_arrays: YearCount[]) {
  const options: OptionType[] = [{ value: "All", label: "All" }];
  year_arrays.map((year_array, index) => {
    let option = {
      value: year_array.year.toString(10),
      label: year_array.year.toString(10),
    };

    options.push(option);
  });

  return options;
}

export function CityOption(countBases: Position[]) {
  const options: OptionType[] = [{ value: "All", label: "All" }];

  countBases.map((countbase, index) => {
    let option = {
      value: countbase.city,
      label: countbase.city,
    };

    options.push(option);
  });

  return options;
}

export function CountYear(bases: Basedata[]) {
  const year_arrays: YearCount[] = [];
  for (let base of bases) {
    const base_year: YearCount = {
      year: base.year,
      lastTime: base.year * 10000 + base.month * 100 + base.day,
      count: 1,
    };

    let flag = true;
    for (let year_array of year_arrays) {
      if (year_array.year == base_year.year) {
        flag = false;
        if (year_array.lastTime == base_year.lastTime) {
          break;
        }

        year_array.count++;
        year_array.lastTime = base_year.lastTime;
      }
    }

    if (flag) {
      year_arrays.push(base_year);
    }
  }

  return year_arrays;
}

export function CountMonth(countYears: Basedata[], year_name: string) {
  const month_arrays: MonthCount[] = [];
  if (year_name == "All") return month_arrays;
  for (let countYear of countYears) {
    if (countYear.year == parseInt(year_name, 10)) {
      let flag = true;
      const month_count: MonthCount = {
        month_name: Month_value2name[countYear.month],
        month_value: countYear.month,
        lastTime:
          countYear.year * 10000 + countYear.month * 100 + countYear.day,
        count: 1,
      };
      for (let month_array of month_arrays) {
        if (month_count.month_value == month_array.month_value) {
          flag = false;
          if (month_count.lastTime > month_array.lastTime) month_array.count++;
          month_array.lastTime = month_count.lastTime;
          break;
        }
      }

      if (flag) {
        month_arrays.push(month_count);
      }
    }
  }

  return month_arrays;
}

export function SortYearAlti(bases: Basedata[]) {
  const year_arrays: AltiCount[] = [];
  for (let base of bases) {
    let flag = true;
    if (year_arrays.length > 0) {
      if (year_arrays[year_arrays.length - 1].day == base.day) {
        flag = false;
      }
    }

    if (flag) {
      const year_array: AltiCount = {
        year: base.year,
        month: base.month,
        day: base.day,
        altitude: base.altitude,
      };

      year_arrays.push(year_array);
    }
  }

  return year_arrays;
}
