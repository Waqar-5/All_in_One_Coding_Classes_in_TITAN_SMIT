// ==========================================
// Import Required Files and Packages
// ==========================================

// Import Student model to interact with MongoDB Student collection
const Student = require("../models/students");

// Import mongoose for MongoDB utilities like ObjectId validation
const mongoose = require("mongoose");


// ==========================================
// CREATE STUDENT
// Route: POST /api/students
// ==========================================

const createStudent = async (req, res) => {

    try {

        // Get student data sent from Postman/client
        const {
            name,
            rollNumber,
            email,
            department,
            semester,
            cgpa,
            age,
            phone,
            city
        } = req.body;


        // Check if all required fields are provided
        if (
            !name ||
            !rollNumber ||
            !email ||
            !department ||
            !semester ||
            cgpa === undefined ||
            !age ||
            !phone ||
            !city
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }


        // Check if email already exists in database
        const emailExists = await Student.findOne({ email });


        if (emailExists) {

            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });

        }


        // Check if roll number already exists
        const rollExists = await Student.findOne({ rollNumber });


        if (rollExists) {

            return res.status(409).json({
                success: false,
                message: "Roll Number already exists."
            });

        }


        // Create new student document in MongoDB
        const student = await Student.create({

            name,
            rollNumber,
            email,
            department,
            semester,
            cgpa,
            age,
            phone,
            city

        });


        // Send successful response
        res.status(201).json({

            success: true,
            message: "Student created successfully.",
            data: student

        });


    } catch (error) {


        // Handle server errors
        res.status(500).json({

            success:false,
            message:error.message

        });


    }

};



// ==========================================
// GET ALL STUDENTS
// Route: GET /api/students
// ==========================================

const getAllStudents = async (req,res)=>{

    try {


        // Find all students and sort newest first
        const students = await Student.find()
        .sort({createdAt:-1});


        res.status(200).json({

            success:true,

            // Total number of students
            totalStudents:students.length,

            data:students

        });


    } catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });


    }

};



// ==========================================
// GET SINGLE STUDENT BY ID
// Route: GET /api/students/:id
// ==========================================

const getStudentById = async(req,res)=>{


    try {


        // Find student using MongoDB ObjectId
        const student = await Student.findById(req.params.id);



        // If student does not exist
        if(!student){

            return res.status(404).json({

                success:false,
                message:"Student not found."

            });

        }



        res.status(200).json({

            success:true,
            data:student

        });


    }catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });


    }

};



// ==========================================
// UPDATE STUDENT
// Route: PUT /api/students/:id
// ==========================================

const updateStudent = async(req,res)=>{


    try{


        // Check whether ID is valid MongoDB ID
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){


            return res.status(400).json({

                success:false,
                message:"Invalid Student ID."

            });

        }



        // Check student exists before updating
        const student = await Student.findById(req.params.id);



        if(!student){

            return res.status(404).json({

                success:false,
                message:"Student not found."

            });

        }



        // Get updated data from request body
        const {

            name,
            rollNumber,
            email,
            department,
            semester,
            cgpa,
            age,
            phone,
            city,
            isGraduated

        } = req.body;



        // Check duplicate email except current student
        if(email){


            const emailExists = await Student.findOne({

                email,

                // Ignore current student's ID
                _id:{
                    $ne:req.params.id
                }

            });



            if(emailExists){

                return res.status(409).json({

                    success:false,
                    message:"Email already exists."

                });

            }

        }



        // Check duplicate roll number except current student
        if(rollNumber){


            const rollExists = await Student.findOne({

                rollNumber,

                _id:{
                    $ne:req.params.id
                }

            });



            if(rollExists){

                return res.status(409).json({

                    success:false,
                    message:"Roll Number already exists."

                });

            }

        }



        // Update student data
        const updatedStudent = await Student.findByIdAndUpdate(

            req.params.id,

            {

                name,
                rollNumber,
                email,
                department,
                semester,
                cgpa,
                age,
                phone,
                city,
                isGraduated

            },


            {
                // Return updated document
                new:true,

                // Apply schema validation rules
                runValidators:true
            }

        );



        res.status(200).json({

            success:true,

            message:"Student updated successfully.",

            data:updatedStudent

        });



    }catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });


    }

};



// ==========================================
// DELETE STUDENT
// Route: DELETE /api/students/:id
// ==========================================

const deleteStudent = async(req,res)=>{


    try{


        // Validate MongoDB ID
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){


            return res.status(400).json({

                success:false,
                message:"Invalid Student ID."

            });

        }



        // Delete student from database
        const deletedStudent =
        await Student.findByIdAndDelete(req.params.id);



        // Check if student exists
        if(!deletedStudent){

            return res.status(404).json({

                success:false,
                message:"Student not found."

            });

        }



        res.status(200).json({

            success:true,

            message:"Student deleted successfully."

        });



    }catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });


    }

};



// Export controller functions
// So routes file can use them
module.exports = {

    createStudent,

    getAllStudents,

    getStudentById,

    updateStudent,

    deleteStudent

};