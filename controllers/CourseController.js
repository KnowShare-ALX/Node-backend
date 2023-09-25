const Course = require('../models/course');
const Content = require('../models/content');
const { validationResult } = require('express-validator');
import FilesController from './FilesController';

export default class CourseController {
  static async createCourse(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, lectures, sections, paid, cost, requirements } = req.body;
      const userId = req.user._id;

      if (paid && (cost === undefined || isNaN(cost) || cost <= 0)) {
        return res.status(400).json({ error: 'Invalid cost for paid course' });
      }

      const course = new Course({
        title,
        description,
        author: userId,
        lectures,
        sections,
        paid,
        cost,
        requirements
      });

      await course.save();

      res.status(201).json({ data: course });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
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
        return res.status(404).json({ error: 'Course not found' });
      }

      if (course.author.toString() !== userId) {
        return res.status(403).json({ error: 'You are not authorized to update this course' });
      }

      const {
        cost,
        paid,
        lectures,
        sections,
        description,
        title,
        requirements
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
      if (requirements !== undefined) {
        course.requirements = requirements;
      }

      course.lastUpdated = Date.now();

      await course.save();

      res.status(200).json({ data: course, msg: 'Course updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
  
  static async addContentToSection(course, sectionTitle, content) {
    let section = course.sections.find((s) => s.title === sectionTitle);
  
    if (!section) {
      section = {
        title: sectionTitle,
        contents: [content._id],
      };
      course.sections.push(section);

    } else {
      if (!section.contents.includes(content._id)) {
        section.contents.push(content._id);
      };
    }
  
    course.lastUpdated = Date.now();

    let lecture = course.lectures.find((l) => l.contentId.toString() === content._id.toString());
    if (!lecture) {
      course.lectures.push({
        title: content.title,
        contentId: content._id,
      });
    }
    try {
      return await course.save();
    } catch(error) {
      console.log(error);
      console.error('Error occured while creating course sections');
      return null;
    }
  }
  
  static async addContentToCourse(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { contentId, parentId, sectionTitle } = req.query;
      const userId = req.user._id;
      if (!parentId) {
        return res.status(400).json({ error: 'parentId is missing' });
      };
      if (!sectionTitle) {
        return res.status(400).json({ error: 'section is missing' });
      }

      const course = await Course.findById(parentId);
      if (!course) {
        return res.status(404).json({ error: 'Invalid course id' });
      }

      if (contentId) {
        const content = await Content.findById(contentId);
        if (!content) {
          return res.status(404).json({ error: 'Invalid content id' });
        }
        if (content.author.toString() === userId.toString() && userId.toString() === course.author.toString()) {
          try {
            const result = await CourseController.addContentToSection(course, sectionTitle, content);
            await Content.updateOne(
              { _id: content._id },
              {
                $addToSet: {
                  course: course._id,
                },
                $set: {
                  lastUpdated: Date.now()
                }
              }
            );
            return res.status(201).json({ data: result });
          } catch(error) {
            console.log(error);
            console.error('Error occured while adding content to course');
            return res.status(500).json({error: 'Internal server error'});
          }

        } else {
          return res.status(403).json({ error: 'User cannot perform this operation' });
        }

      } else {
        try {
        // Create new content and upload to course
        const content = await FilesController.createContent(req, res);
        content.course.push(course._id.toString());

        // Save the content to the database
        await content.save();
        const result = await CourseController.addContentToSection(course, sectionTitle, content);
        return res.status(201).json({ data: result });
        } catch(error) {
          console.error(error);
          console.error('Error occured while creating content')
          return res.status(500).json({error: 'Internal server error'});
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}