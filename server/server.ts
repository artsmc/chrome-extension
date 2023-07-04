```typescript
import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import apiRoutes from './routes/api';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
```