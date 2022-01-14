/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { dateFormat } from '../../shared/utils/dateformat';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const qtdWords = post.data.content.reduce((quantityWords, content) => {
    const totalWordsBodies = content.body.reduce((quantity, body) => {
      return body.text.split(' ').length + quantity;
    }, 0);

    return quantityWords + totalWordsBodies;
  }, 0);

  const timeToRead = (qtdWords / 200).toFixed(0);

  return (
    <>
      <Header />
      <img className={styles.banner} src={post.data.banner.url} />
      <div className={styles.head}>
        <h1 className={styles.title}>{post.data.title}</h1>
        <ul className={styles.info}>
          <li>
            <FiCalendar /> {dateFormat(new Date(post.first_publication_date))}
          </li>
          <li>
            <FiUser /> {post.data.author}
          </li>
          <li>
            <FiClock /> {timeToRead} min
          </li>
        </ul>
      </div>

      <div className={styles.content}>
        {post.data.content.map(content => {
          return (
            <div className={styles.body}>
              <h2>{content.heading}</h2>
              {content.body.map(body => {
                return <p dangerouslySetInnerHTML={{ __html: body?.text }} />;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      fetch: ['uid'],
      pageSize: 10,
    }
  );

  return {
    paths: postsResponse.results?.map(post => {
      return { params: { slug: post.uid } };
    }),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { params } = context;
  const { slug } = params;

  const prismic = getPrismicClient();
  const post = await prismic.getByUID('post', String(slug), {});

  return {
    props: {
      post,
    },
  };
};
