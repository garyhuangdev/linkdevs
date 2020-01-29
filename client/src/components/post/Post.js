import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { getPost } from '../../actions/post';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPost]);

  return (
    <>
      {loading || post === null ? (
        <Spinner />
      ) : (
        <>
          <Link to="/posts" className="btn btn-light">
            Back To Posts
          </Link>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <div className="comments">
            {post.comments.map(comment => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={post._id}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  post: state.postReducer
});

const mapDispatchToProps = {
  getPost
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
