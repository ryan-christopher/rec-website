fn find_abundant_nums(max: i32) -> Vec<i32> {
    let mut abundant_nums: Vec<i32> = Vec::new();
    for x in 1..=max {
        if is_abundant(x){
            abundant_nums.push(x);
        }
    }
    abundant_nums
}

fn is_abundant(val: i32) -> bool {
    let mut div_sum: i32 = 1;
    for x in 2..=val / 2 {
        if val % x == 0 {
            div_sum += x;
        }
    }
    if div_sum > val {
        true
    }
    else {
        false
    }
}

fn find_abundant_sums(abundant_nums: Vec<i32>, max: i32) -> Vec<i32> {
    let mut abundant_sums: Vec<i32> = vec![0; max as usize];
    for x in 0..abundant_nums.len() {
        for y in x..abundant_nums.len() {
            let sum = abundant_nums[x] + abundant_nums[y];
            if sum < max {
                abundant_sums[sum as usize] = 1;
            }
        }
    }
    abundant_sums
}

fn find_non_sums_sum(abundant_sums: Vec<i32>) -> usize {
    let mut sum: usize = 0;
    for val in 1..abundant_sums.len() {
        if abundant_sums[val] == 0 {
            sum += val;
        }
    }
    sum
}