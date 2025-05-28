export type Basedata = {
  year: number;
  month: number;
  day: number;
  longitude: number;
  latitude: number;
  altitude: number;
};

export type Rawdata = {
  DataTime: string;
  altitude: string;
  latitude: string;
  longitude: string;
};

export type Position = {
  longitude: number;
  latitude: number;
  city: string;
  count: number;
  lastTime: number;
};

export type Place = {
  province: string;
  city: string;
  district: string;
  suburb: string;
  cityCount: number;
};

export type YearCount = {
  year: number;
  lastTime: number;
  count: number;
};

export type AltiCount = {
    year: number,
    month: number,
    day: number,
    altitude: number
}

export function check_position(n1: Position, n2: Position) {
  return (
    n1.latitude - n2.latitude < 0.5 &&
    n1.longitude - n2.longitude < 0.5 &&
    n2.latitude - n1.latitude < 0.5 &&
    n2.longitude - n1.longitude < 0.5
  );
}

export function check_district_position(n1: Position, n2: Position) {
  return (
    n1.latitude - n2.latitude < 0.01 &&
    n1.longitude - n2.longitude < 0.01 &&
    n2.latitude - n1.latitude < 0.01 &&
    n2.longitude - n1.longitude < 0.01
  );
}

// need for longitude and latitude
export function find_for_city(pos_arrays: Position[], city_name: string) {
  for (let pos_array of pos_arrays) {
    if (pos_array.city == city_name) {
      return pos_array;
    }
  }

  return pos_arrays[0];
}

export function filter_for_city(bases: Basedata[], city_pos: Position) {
  const filter_pos: Position[] = [];
  for (let base of bases) {
    const base_position: Position = {
      longitude: base.longitude,
      latitude: base.latitude,
      city: city_pos.city,
      count: 1,
      lastTime: base.day,
    };

    if (
      check_position(base_position, city_pos) &&
      (filter_pos.length == 0 ||
        (filter_pos.length > 0 &&
          filter_pos[filter_pos.length - 1].lastTime < base_position.lastTime))
    ) {
      filter_pos.push(base_position);
    }
  }

  return filter_pos;
}

export function count_for_district(filter_poss: Position[]) {
  const countdis: Position[] = [];
  for (let filter_pos of filter_poss) {
    let flag = true;
    for (let countdi of countdis) {
      if (check_district_position(countdi, filter_pos)) {
        flag = false;
        countdi.count++;
        break;
      }
    }

    if (flag) {
      countdis.push(filter_pos);
    }
  }

  return countdis;
}
