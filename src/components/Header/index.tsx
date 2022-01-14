import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <a href="/">
        <img src="/img/logo.svg" alt="" />
      </a>
    </header>
  );
}
