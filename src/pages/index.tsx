/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';
import { dateFormat } from '../shared/utils/dateformat';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <>
      <Head>
        <title>HOME | Desafio 01</title>
      </Head>
      <Header />
      <main className={styles.container}>
        {postsPagination.results.map(post => {
          return (
            <div className={styles.post}>
              <a href={`/post/${post.uid}`}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.infoContent}>
                  <div>
                    <FiCalendar />{' '}
                    {dateFormat(new Date(post.first_publication_date))}
                  </div>
                  <div>
                    <FiUser /> {post.data.author}
                  </div>
                </div>
              </a>
            </div>
          );
        })}

        <p className={styles.btnMore}>Carregar mais posts</p>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 10,
    }
  );

  const postsPagination: PostPagination = postsResponse;

  return {
    props: { postsPagination },
  };
};
