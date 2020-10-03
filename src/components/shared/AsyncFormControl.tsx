
import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';

type Props = {
  validate: (t: string) => boolean,
  onChange: (t: string) => void
};
