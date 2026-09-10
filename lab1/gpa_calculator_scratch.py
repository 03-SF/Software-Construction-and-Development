def get_mark(label, maximum):
    while True:
        try:
            mark = float(input(f"Enter {label} (out of {maximum}): "))
        except ValueError:
            print("Please enter a number.")
            continue

        if 0 <= mark <= maximum:
            return mark

        print(f"Enter a mark between 0 and {maximum}.")


def get_grade(total):
    grade_scale = [
        (85, "A", 4.0),
        (80, "A-", 3.7),
        (75, "B+", 3.3),
        (71, "B", 3.0),
        (68, "B-", 2.7),
        (64, "C+", 2.3),
        (58, "C", 2.0),
        (54, "C-", 1.7),
        (50, "D", 1.0),
        (0, "F", 0.0),
    ]

    for minimum, grade, gpa in grade_scale:
        if total >= minimum:
            return grade, gpa


def calculate_total(quizzes, assignments, midterm, final_exam):
    quiz_average = sum(quizzes) / len(quizzes)
    assignment_average = sum(assignments) / len(assignments)
    return (quiz_average * 0.15) + (assignment_average * 0.10) + midterm + final_exam


def main():
    print("\nGPA Calculator\n")

    quizzes = [get_mark(f"quiz {number}", 100) for number in range(1, 5)]
    assignments = [get_mark(f"assignment {number}", 100) for number in range(1, 5)]
    midterm = get_mark("midterm", 25)
    final_exam = get_mark("final exam", 50)

    total = calculate_total(quizzes, assignments, midterm, final_exam)
    grade, gpa = get_grade(total)

    print("\nResults")
    print(f"Total percentage: {total:.2f}%")
    print(f"Grade: {grade}")
    print(f"GPA: {gpa:.1f} / 4.0")


if __name__ == "__main__":
    main()
