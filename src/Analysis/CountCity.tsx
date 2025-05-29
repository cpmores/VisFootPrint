import {
  check_district_position,
  check_position,
  type Basedata,
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
      lastTime: base.day,
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
  const options: OptionType[] = [
    {value: 'All', label: 'All'},
  ];
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
    const options: OptionType[] = [
        {value: 'All', label: 'All'},
    ];

    countBases.map((countbase, index) => {
        let option = {
            value: countbase.city,
            label: countbase.city
        };

        options.push(option);
    })

    return options;
}

export function CountYear(bases: Basedata[]) {
  const year_arrays: YearCount[] = [];
  for (let base of bases) {
    const base_year: YearCount = {
      year: base.year,
      lastTime: base.day,
      count: 1,
    };

    let flag = true;
    for (let year_array of year_arrays) {
      if (year_array.year == base_year.year) {
        flag = false;
        if (year_array.lastTime <= base_year.lastTime) {
          year_array.count++;
          break;
        }

        year_array.lastTime = base_year.lastTime;
      }
    }

    if (flag) {
      year_arrays.push(base_year);
    }
  }

  return year_arrays;
}
