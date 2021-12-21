class StudentRepository{
    countBanned(students){
        return students.reduce(function(accumulator, student){
            if (student.banned){
                if (student.banned.comment || student.banned.login) return accumulator += 1;
                else return accumulator;
            }
        }, 0)
    }
}

module.exports = new StudentRepository();