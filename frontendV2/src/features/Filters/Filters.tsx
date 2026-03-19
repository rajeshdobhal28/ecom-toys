import { useState } from 'react';
import styles from './Filters.module.scss'
import { HIGH_LEVEL_CATEGORIES } from '@/utils/constant';

const Filters = () => {
    const [activeCategory, setActiveCategory] = useState<string>("");

    return <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Filters</h3>

        <div className={styles.filterGroup}>
            <h4 className={styles.filterLabel}>Category</h4>
            <div className={styles.chips}>
                <button
                    className={`${styles.chip} ${activeCategory === "" ? styles.chipActive : ""}`}
                    onClick={() => setActiveCategory("")}
                >
                    All
                </button>
                {HIGH_LEVEL_CATEGORIES.map((cat) => (
                    <button
                        key={cat.slug}
                        className={`${styles.chip} ${activeCategory === cat.slug ? styles.chipActive : ""}`}
                        onClick={() => setActiveCategory(cat.slug)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    </aside>
}

export default Filters;