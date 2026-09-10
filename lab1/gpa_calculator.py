q1 = float(input("Enter quiz 1 marks: "))
q2 = float(input("Enter quiz 2 marks: "))
q3 = float(input("Enter quiz 3 marks: "))
q4 = float(input("Enter quiz 4 marks: "))

a1 = float(input("Enter assignment 1 marks: "))
a2 = float(input("Enter assignment 2 marks: "))
a3 = float(input("Enter assignment 3 marks: "))
a4 = float(input("Enter assignment 4 marks: "))

mid = float(input("Enter midterm marks (out of 25): "))
final_exam = float(input("Enter final exam marks (out of 50): "))

quiz_avg = (q1 + q2 + q3 + q4) / 4
assignment_avg = (a1 + a2 + a3 + a4) / 4

total = (quiz_avg * 0.15) + (assignment_avg * 0.10) + mid + final_exam

print("Your total percentage is:", total)

if total >= 85:
    print("Your grade is: A")

elif total >= 80:
    print("Your grade is: A-")

elif total >= 75:
    print("Your grade is: B+")

elif total >= 71:
    print("Your grade is: B")

elif total >= 68:
    print("Your grade is: B-")

elif total >= 64:
    print("Your grade is: C+")

elif total >= 58:
    print("Your grade is: C")

elif total >= 54:
    print("Your grade is: C-")

elif total >= 50:
    print("Your grade is: D")

else:
    print("Your grade is: F")