fn sum_amicable_nums(val: i32) -> i32 {
    let mut amicable_sum = 0;
    let mut known_amicables: Vec<i32> = Vec::new();
    for a in 1..=val {
        let da = find_divisor_sum(a);
        if !known_amicables.contains(&a) && !known_amicables.contains(&da){
            let db = find_divisor_sum(da);
            if (a == db) && (da != a) && (a < 10000) && (da < 10000){
                known_amicables.push(a);
                known_amicables.push(da);
                amicable_sum += a + da;
            }
        }
    }
    amicable_sum
}

fn find_divisor_sum(val: i32) -> i32 {
    let mut divisor_sum = 0;
    for x in 1..=(val / 2) + 1{
        if val % x == 0 {
            divisor_sum += x;
        }
    }
    divisor_sum
}