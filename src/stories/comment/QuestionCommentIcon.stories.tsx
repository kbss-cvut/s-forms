import React from 'react';
import QuestionCommentIcon from '../../components/comment/QuestionCommentIcon';
import question from '../assets/question.json';
import questionWithComment from '../assets/questionWithComment.json';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Comment/QuestionCommentIcon',
  component: QuestionCommentIcon
} as ComponentMeta<typeof QuestionCommentIcon>;

const Template: ComponentStory<typeof QuestionCommentIcon> = (args) => {
  return <QuestionCommentIcon {...args} onChange={action('New comment')} />;
};

export const Default = Template.bind({});
Default.args = {
  question: question,
};

export const WithComment = Template.bind({});
WithComment.args = {
  question: questionWithComment
};
