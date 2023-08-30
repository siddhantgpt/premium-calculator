from datetime import datetime


def calculate_premium(member_data, rate_card, sum_assured):
    oldest_member = get_oldest_member(member_data)
    total_premium = 0

    for member in member_data:
        age = calculate_age(member['dob'])
        age_range = get_age_range(age)
        premium_rate = rate_card['premium_data'][age_range][str(sum_assured)]
        floater_discount = 0
        if member['name'] != oldest_member:
            floater_discount = 0.5
        discounted_rate = premium_rate * (1-floater_discount)
        total_premium += discounted_rate
        member['premium_rate'] = premium_rate
        member['floater_discount'] = floater_discount
        member['discounted_rate'] = discounted_rate

    return total_premium


def calculate_age(dob):
    today = datetime.today()
    dob_date = datetime.strptime(dob, '%Y-%m-%d')
    age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))
    return age


def get_age_range(age):
    if 18 <= age <= 24:
        return "18-24"
    elif 25 <= age <= 35:
        return "25-35"
    elif 36 <= age <= 40:
        return "36-40"
    elif 41 <= age <= 45:
        return "41-45"
    elif 46 <= age <= 50:
        return "46-50"
    elif 51 <= age <= 55:
        return "51-55"
    elif 56 <= age <= 60:
        return "56-60"
    elif 61 <= age <= 65:
        return "61-65"
    elif 66 <= age <= 70:
        return "66-70"
    elif 71 <= age <= 75:
        return "71-75"
    elif 76 <= age <= 99:
        return "76-99"
    else:
        return None


def get_oldest_member(member_data):
    max_age = -1
    oldest_member = ""

    for member in member_data:
        age = calculate_age(member['dob'])
        if age > max_age:
            oldest_member = member['name']
            max_age = age
        return oldest_member
