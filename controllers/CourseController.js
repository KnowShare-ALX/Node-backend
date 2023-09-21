const Course = require('../models/course');
const { validationResult } = require('express-validator');

export default class CourseController {
  static async createCourse(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, lectures, sections, paid, cost } = req.body;
      const userId = req.user._id;

      if (paid && (cost === undefined || isNaN(cost) || cost <= 0)) {
        return res.status(400).json({ msg: 'Invalid cost for paid course' });
      }

      const course = new Course({
        title,
        description,
        author: userId,
        lectures,
        sections,
        paid,
        cost,
      });

      await course.save();

      res.status(201).json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  }

  static async updateCourse(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const courseId = req.params.id;
      const userId = req.user.id;
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }

      if (course.author.toString() !== userId) {
        return res.status(403).json({ msg: 'You are not authorized to update this course' });
      }

      const {
        cost,
        paid,
        lectures,
        sections,
        description,
        title,
      } = req.body;

      if (cost !== undefined) {
        course.cost = cost;
      }

      if (paid !== undefined) {
        course.paid = paid;
      }

      if (lectures !== undefined) {
        course.lectures = lectures;
      }

      if (sections !== undefined) {
        course.sections = sections;
      }

      if (description !== undefined) {
        course.description = description;
      }

      if (title !== undefined) {
        course.title = title;
      }

      course.lastUpdated = Date.now();

      await course.save();

      res.status(200).json({ msg: 'Course updated successfully', course });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
}