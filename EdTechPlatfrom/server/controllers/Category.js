const Category = require("../models/Category");

// create Tag ka handler fucntion 
exports.createCategory = async (req,res) => {
    try{
        // fecth data from request body
        const {name, description} = req.body;

        // validation
        if(!name || !description){
            return res.status(400).json({
                success : false,
                message : 'All fields are required',
            })
        }

        // create entry in the database
        const CategoryDetails = await Category.create({
            name : name,
            description : description,
        });
        console.log(CategoryDetails);

        // return response
        return res.status(200).json({
            success : true,
            message : "Category Created Successfully",
        });

    }catch(error){
        return res.status(500).json({
            success : false,
            message : error.message,
        });
    }
}


// getAll Categories handler function
exports.showAllCategories = async (req,res) => {
    try{

        // find allTags and make sure that name and description should be there.
        const allCategorys = await Category.find({},{name:true, description : true});
        
        // return response
        res.status(200).json({
            success : true,
            message : "All tags returned successfully",
            allCategorys
        });
    }catch(error){
        return res.status(500).json({
            success : false,
            message : error.message,
        });
    }
}


exports.categoryPageDetails = async (req, res) => {
	try {
		// get Category Id
		const { categoryId } = req.body;

		// Get courses for the specified categoryId
		const selectedCategory = await Category.findById(categoryId)
													.populate("courses")
													.exec();
		console.log(selectedCategory);
		// Handle the case when the category is not found
		if (!selectedCategory) {
			console.log("Category not found.");
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
		}
		// Handle the case when there are no courses
		if (selectedCategory.courses.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

		const selectedCourses = selectedCategory.courses;

		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		}).populate("courses");
		let differentCourses = [];
		for (const category of categoriesExceptSelected) {
			differentCourses.push(...category.courses);
		}

		// Get top-selling courses across all categories
		const allCategories = await Category.find().populate("courses");
		const allCourses = allCategories.flatMap((category) => category.courses);
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);

		res.status(200).json({
			success : true,
			data: {
				selectedCourses: selectedCourses,
				differentCourses: differentCourses,
				mostSellingCourses: mostSellingCourses,
			}
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};